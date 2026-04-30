const Notification = require('../models/Notification.js');
const Session = require('../models/Session.js');
const Client = require('../models/Client.js');
const User = require('../models/user.js');

function safeName(name, fallback) {
  const value = String(name || '').trim();
  return value || fallback;
}

async function listByUser(userId) {
  return Notification.findAll({
    where: { user_id: userId },
    order: [['createdAt', 'DESC']],
    limit: 100,
  });
}

async function markAllAsRead(userId) {
  const [count] = await Notification.update(
    { lida: true },
    { where: { user_id: userId, lida: false } },
  );
  return count;
}

async function markOneAsRead(userId, notificationId) {
  const [count] = await Notification.update(
    { lida: true },
    {
      where: {
        user_id: userId,
        notification_id: notificationId,
      },
    },
  );
  return count > 0;
}

async function createNotification(payload) {
  return Notification.create(payload);
}

async function findSessionWithActors(sessaoId) {
  return Session.findByPk(sessaoId, {
    include: [
      {
        model: Client,
        as: 'cliente',
        attributes: ['nome', 'cpf'],
      },
      {
        model: User,
        attributes: ['user_id', 'nome', 'sobrenome'],
      },
    ],
  });
}

async function findAppUserByCpf(cpf) {
  const digits = String(cpf || '').replace(/\D/g, '');
  if (digits.length !== 11) return null;
  return User.findOne({ where: { cpf: digits }, attributes: ['user_id'] });
}

async function notifySessionCreated(sessaoId) {
  const sessao = await findSessionWithActors(sessaoId);
  if (!sessao?.cliente?.cpf) return null;

  const clienteUser = await findAppUserByCpf(sessao.cliente.cpf);
  if (!clienteUser) return null;

  const tatuadorNome = safeName(
    `${sessao.User?.nome || ''} ${sessao.User?.sobrenome || ''}`,
    'tatuador',
  );

  return createNotification({
    user_id: clienteUser.user_id,
    sessao_id: sessao.sessao_id,
    tipo: 'SESSION_CREATED',
    titulo: 'Sessao marcada',
    mensagem: `Sua sessao com ${tatuadorNome} foi agendada.`,
  });
}

async function notifySessionCanceled(sessaoId, actorUserId) {
  const sessao = await findSessionWithActors(sessaoId);
  if (!sessao) return [];

  const tatuadorId = sessao.usuario_id;
  const clienteUser = await findAppUserByCpf(sessao.cliente?.cpf);
  const destinatarios = [];

  if (Number.isFinite(Number(tatuadorId)) && Number(tatuadorId) !== Number(actorUserId)) {
    destinatarios.push(Number(tatuadorId));
  }
  if (
    clienteUser?.user_id != null &&
    Number(clienteUser.user_id) !== Number(actorUserId)
  ) {
    destinatarios.push(Number(clienteUser.user_id));
  }

  const unique = [...new Set(destinatarios)];
  if (unique.length === 0) return [];

  const clienteNome = safeName(sessao.cliente?.nome, 'cliente');
  return Promise.all(
    unique.map((userId) =>
      createNotification({
        user_id: userId,
        sessao_id: sessao.sessao_id,
        tipo: 'SESSION_CANCELED',
        titulo: 'Sessao cancelada',
        mensagem: `Uma sessao de ${clienteNome} foi cancelada.`,
      }),
    ),
  );
}

async function notifyReviewAvailable(sessaoId) {
  const sessao = await findSessionWithActors(sessaoId);
  if (!sessao?.cliente?.cpf || !sessao.realizado || sessao.cancelado) return null;

  const clienteUser = await findAppUserByCpf(sessao.cliente.cpf);
  if (!clienteUser) return null;

  return createNotification({
    user_id: clienteUser.user_id,
    sessao_id: sessao.sessao_id,
    tipo: 'REVIEW_AVAILABLE',
    titulo: 'Avaliacao disponivel',
    mensagem: 'Sua sessao foi concluida. Agora voce ja pode avaliar o tatuador.',
  });
}

module.exports = {
  listByUser,
  markAllAsRead,
  markOneAsRead,
  createNotification,
  notifySessionCreated,
  notifySessionCanceled,
  notifyReviewAvailable,
};
