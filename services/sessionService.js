const sessao = require('../models/Session.js');
const { Op } = require('sequelize');

async function verifySession(userId, sessionId) {
  const session = await sessao.findOne({
    where: { sessao_id: sessionId, usuario_id: userId }
  })

  return !!session;
}

async function getAll(userId) {
  return await sessao.findAll({
    where: { usuario_id: userId }
  });
}

async function getById(userId, sessionId) {
  return await sessao.findOne({
    where: { sessao_id: sessionId, usuario_id: userId }
  });
}

async function getByClientId(userId, clientId) {
  return await sessao.findAll({
    where: { cliente_id: clientId, usuario_id: userId }
  });
}

async function getByDate(userId, date) {
  const startOfDay = new Date(`${date}T00:00:00-03:00`);
  const endOfDay = new Date(`${date}T23:59:59-03:00`);

  return await sessao.findAll({
    where: {
      usuario_id: userId,
      data_atendimento: {
        [Op.between]: [startOfDay, endOfDay]
      }
    }
  });
}

async function changeStatus(sessionId, realizado) {
  const session = await sessao.findByPk(sessionId);
  if (!session) {
    throw new Error('Sessão não encontrada');
  }

  session.realizado = realizado;
  await session.save();
  return session;
}

async function updateSession(sessionId, newSession) {
  const session = await sessao.findByPk(sessionId);
  if (!session) {
    throw new Error('Sessão não encontrada');
  }

  Object.assign(session, newSession);
  await session.save();
  return session;
}

async function createSession(newSession) {
  return await sessao.create(newSession);
}

async function deleteSession(sessionId) {
  const session = await sessao.findByPk(sessionId);
  if (!session) {
    throw new Error('Sessão não encontrada');
  }
  await session.destroy();
  return;
}

async function getPendingSessions(userId) {
  const sessions = await sessao.findAll({
    where: { usuario_id: userId, realizado: false },
  }
  )
  return sessions;
}

async function getRealizedSessions(userId) {
  const sessions = await sessao.findAll({
    where: { usuario_id: userId, realizado: true },
  }
  )
  return sessions;
}

async function getCanceledSessions(userId) {
  const sessions = await sessao.findAll({
    where: { usuario_id: userId, cancelado: true },
  }
  )
  return sessions;
}

async function getClientPendingSessions(userId, clientId) {
  const sessions = await sessao.findAll({
    where: { usuario_id: userId, cliente_id: clientId, realizado: false },
  })
  return sessions;
}

async function getClientRealizedSessions(userId, clientId) {
  const sessions = await sessao.findAll({
    where: { usuario_id: userId, cliente_id: clientId, realizado: true },
  })
  return sessions;
}

async function getClientCanceledSessions(userId, clientId) {
  const sessions = await sessao.findAll({
    where: { usuario_id: userId, cliente_id: clientId, cancelado: true },
  })
  return sessions;
}

async function getPendingSessionsByDate(userId, date) {
  const startOfDay = new Date(`${date}T00:00:00-03:00`);
  const endOfDay = new Date(`${date}T23:59:59-03:00`);
  const sessions = await sessao.findAll({
    where: { usuario_id: userId, realizado: false, data_atendimento: { [Op.between]: [startOfDay, endOfDay] } }
  })
  return sessions;
}

async function getRealizedSessionsByDate(userId, date) {
  const startOfDay = new Date(`${date}T00:00:00-03:00`);
  const endOfDay = new Date(`${date}T23:59:59-03:00`);
  const sessions = await sessao.findAll({
    where: { usuario_id: userId, realizado: true, data_atendimento: { [Op.between]: [startOfDay, endOfDay] } }
  })
  return sessions;
}

async function getCanceledSessionsByDate(userId, date) {
  const startOfDay = new Date(`${date}T00:00:00-03:00`);
  const endOfDay = new Date(`${date}T23:59:59-03:00`);
  const sessions = await sessao.findAll({
    where: { usuario_id: userId, cancelado: true, data_atendimento: { [Op.between]: [startOfDay, endOfDay] } }
  })
  return sessions;
}

async function getClientPendingSessionsByDate(userId, clientId, date) {
  const startOfDay = new Date(`${date}T00:00:00-03:00`);
  const endOfDay = new Date(`${date}T23:59:59-03:00`);
  const sessions = await sessao.findAll({
    where: { usuario_id: userId, cliente_id: clientId, realizado: false, data_atendimento: { [Op.between]: [startOfDay, endOfDay] } }
  })
  return sessions;
}

async function getClientRealizedSessionsByDate(userId, clientId, date) {
  const startOfDay = new Date(`${date}T00:00:00-03:00`);
  const endOfDay = new Date(`${date}T23:59:59-03:00`);
  const sessions = await sessao.findAll({
    where: { usuario_id: userId, cliente_id: clientId, realizado: true, data_atendimento: { [Op.between]: [startOfDay, endOfDay] } }
  })
  return sessions;
}

async function getClientCanceledSessionsByDate(userId, clientId, date) {
  const startOfDay = new Date(`${date}T00:00:00-03:00`);
  const endOfDay = new Date(`${date}T23:59:59-03:00`);
  const sessions = await sessao.findAll({
    where: { usuario_id: userId, cliente_id: clientId, cancelado: true, data_atendimento: { [Op.between]: [startOfDay, endOfDay] } }
  })
  return sessions;
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
