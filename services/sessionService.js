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

module.exports = { verifySession, getAll, getById, getByClientId, getByDate, changeStatus, updateSession, createSession, deleteSession };
