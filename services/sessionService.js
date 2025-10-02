const sessao = require('../models/Session.js');
const client = require('../models/Client.js');
const { Op } = require('sequelize');

const includeCliente = [
  {
    model: client,
    as: 'cliente',
    attributes: ['client_id', 'nome', 'telefone']
  }
];

async function verifySession(userId, sessionId) {
  const session = await sessao.findOne({
    where: { sessao_id: sessionId, usuario_id: userId },
    include: includeCliente
  });
  return !!session;
}

async function getAll(userId) {
  return await sessao.findAll({
    where: { usuario_id: userId },
    include: includeCliente
  });
}

async function getById(userId, sessionId) {
  return await sessao.findOne({
    where: { sessao_id: sessionId, usuario_id: userId },
    include: includeCliente
  });
}

async function getByClientId(userId, clientId) {
  return await sessao.findAll({
    where: { cliente_id: clientId, usuario_id: userId },
    include: includeCliente
  });
}

async function getByDate(userId, date) {
  const startOfDay = new Date(`${date}T00:00:00-03:00`);
  const endOfDay = new Date(`${date}T23:59:59-03:00`);

  return await sessao.findAll({
    where: {
      usuario_id: userId,
      data_atendimento: { [Op.between]: [startOfDay, endOfDay] }
    },
    include: includeCliente
  });
}

async function changeStatus(sessionId, realizado) {
  const session = await sessao.findByPk(sessionId, { include: includeCliente });
  if (!session) throw new Error('Sessão não encontrada');

  session.realizado = realizado;
  await session.save();
  return session;
}

async function updateSession(sessionId, newSession) {
  const session = await sessao.findByPk(sessionId, { include: includeCliente });
  if (!session) throw new Error('Sessão não encontrada');

  Object.assign(session, newSession);
  await session.save();
  return session;
}

async function createSession(newSession) {
  return await sessao.create(newSession);
}

async function deleteSession(sessionId) {
  const session = await sessao.findByPk(sessionId, { include: includeCliente });
  if (!session) throw new Error('Sessão não encontrada');

  await session.destroy();
  return;
}

// Sessões pendentes, realizadas e canceladas
async function getPendingSessions(userId) {
  return await sessao.findAll({
    where: { usuario_id: userId, realizado: false },
    include: includeCliente
  });
}

async function getRealizedSessions(userId) {
  return await sessao.findAll({
    where: { usuario_id: userId, realizado: true },
    include: includeCliente
  });
}

async function getCanceledSessions(userId) {
  return await sessao.findAll({
    where: { usuario_id: userId, cancelado: true },
    include: includeCliente
  });
}

// Sessões por cliente
async function getClientPendingSessions(userId, clientId) {
  return await sessao.findAll({
    where: { usuario_id: userId, cliente_id: clientId, realizado: false },
    include: includeCliente
  });
}

async function getClientRealizedSessions(userId, clientId) {
  return await sessao.findAll({
    where: { usuario_id: userId, cliente_id: clientId, realizado: true },
    include: includeCliente
  });
}

async function getClientCanceledSessions(userId, clientId) {
  return await sessao.findAll({
    where: { usuario_id: userId, cliente_id: clientId, cancelado: true },
    include: includeCliente
  });
}

// Sessões pendentes, realizadas e canceladas por data
async function getPendingSessionsByDate(userId, date) {
  const startOfDay = new Date(`${date}T00:00:00-03:00`);
  const endOfDay = new Date(`${date}T23:59:59-03:00`);
  return await sessao.findAll({
    where: { usuario_id: userId, realizado: false, data_atendimento: { [Op.between]: [startOfDay, endOfDay] } },
    include: includeCliente
  });
}

async function getRealizedSessionsByDate(userId, date) {
  const startOfDay = new Date(`${date}T00:00:00-03:00`);
  const endOfDay = new Date(`${date}T23:59:59-03:00`);
  return await sessao.findAll({
    where: { usuario_id: userId, realizado: true, data_atendimento: { [Op.between]: [startOfDay, endOfDay] } },
    include: includeCliente
  });
}

async function getCanceledSessionsByDate(userId, date) {
  const startOfDay = new Date(`${date}T00:00:00-03:00`);
  const endOfDay = new Date(`${date}T23:59:59-03:00`);
  return await sessao.findAll({
    where: { usuario_id: userId, cancelado: true, data_atendimento: { [Op.between]: [startOfDay, endOfDay] } },
    include: includeCliente
  });
}

// Sessões por cliente e data
async function getClientPendingSessionsByDate(userId, clientId, date) {
  const startOfDay = new Date(`${date}T00:00:00-03:00`);
  const endOfDay = new Date(`${date}T23:59:59-03:00`);
  return await sessao.findAll({
    where: { usuario_id: userId, cliente_id: clientId, realizado: false, data_atendimento: { [Op.between]: [startOfDay, endOfDay] } },
    include: includeCliente
  });
}

async function getClientRealizedSessionsByDate(userId, clientId, date) {
  const startOfDay = new Date(`${date}T00:00:00-03:00`);
  const endOfDay = new Date(`${date}T23:59:59-03:00`);
  return await sessao.findAll({
    where: { usuario_id: userId, cliente_id: clientId, realizado: true, data_atendimento: { [Op.between]: [startOfDay, endOfDay] } },
    include: includeCliente
  });
}

async function getClientCanceledSessionsByDate(userId, clientId, date) {
  const startOfDay = new Date(`${date}T00:00:00-03:00`);
  const endOfDay = new Date(`${date}T23:59:59-03:00`);
  return await sessao.findAll({
    where: { usuario_id: userId, cliente_id: clientId, cancelado: true, data_atendimento: { [Op.between]: [startOfDay, endOfDay] } },
    include: includeCliente
  });
}

module.exports = {
  verifySession,
  getAll,
  getById,
  getByClientId,
  getByDate,
  changeStatus,
  updateSession,
  createSession,
  deleteSession,
  getPendingSessions,
  getRealizedSessions,
  getCanceledSessions,
  getClientPendingSessions,
  getClientRealizedSessions,
  getClientCanceledSessions,
  getPendingSessionsByDate,
  getRealizedSessionsByDate,
  getCanceledSessionsByDate,
  getClientPendingSessionsByDate,
  getClientRealizedSessionsByDate,
  getClientCanceledSessionsByDate
};
