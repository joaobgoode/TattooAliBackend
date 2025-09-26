const sessao = require('../models/Session.js');
const client = require('../models/Client.js');
const { Op } = require('sequelize');

async function verifySession(userId, sessionId) {
  const session = await sessao.findOne({
    where: { sessao_id: sessionId, usuario_id: userId }
  })

  return !!session;
}

async function getAll(userId) {
  return await sessao.findAll({
    where: { 
      usuario_id: userId
      // Removido o filtro realizado: null para retornar todas as sessões
    },
    include: [{
      model: client,
      as: 'cliente',
      attributes: ['client_id', 'nome', 'telefone']
    }],
    order: [['data_atendimento', 'ASC']]
  });
}

async function getById(userId, sessionId) {
  return await sessao.findOne({
    where: { sessao_id: sessionId, usuario_id: userId },
    include: [{
      model: client,
      as: 'cliente',
      attributes: ['client_id', 'nome', 'telefone']
    }]
  });
}

async function getByClientId(userId, clientId) {
  return await sessao.findAll({
    where: { 
      cliente_id: clientId, 
      usuario_id: userId
      // Removido filtro realizado para retornar todas as sessões do cliente
    },
    include: [{
      model: client,
      as: 'cliente',
      attributes: ['client_id', 'nome', 'telefone']
    }],
    order: [['data_atendimento', 'ASC']]
  });
}

// Função para buscar apenas sessões pendentes de um cliente específico
async function getSessoesPendentesByClient(userId, clientId) {
  return await sessao.findAll({
    where: { 
      cliente_id: clientId, 
      usuario_id: userId,
      realizado: null // Apenas sessões pendentes
    },
    include: [{
      model: client,
      as: 'cliente',
      attributes: ['client_id', 'nome', 'telefone']
    }],
    order: [['data_atendimento', 'ASC']]
  });
}

// Função para buscar apenas sessões realizadas de um cliente específico
async function getSessoesRealizadasByClient(userId, clientId) {
  return await sessao.findAll({
    where: { 
      cliente_id: clientId, 
      usuario_id: userId,
      realizado: true // Apenas sessões realizadas
    },
    include: [{
      model: client,
      as: 'cliente',
      attributes: ['client_id', 'nome', 'telefone']
    }],
    order: [['data_atendimento', 'DESC']]
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
      // Removido o filtro realizado: null para retornar todas as sessões da data
    },
    include: [{
      model: client,
      as: 'cliente',
      attributes: ['client_id', 'nome', 'telefone']
    }],
    order: [['data_atendimento', 'ASC']]
  });
}

// Função para buscar apenas sessões pendentes por data
async function getSessoesPendentes(userId, date) {
  const startOfDay = new Date(`${date}T00:00:00-03:00`);
  const endOfDay = new Date(`${date}T23:59:59-03:00`);

  return await sessao.findAll({
    where: {
      usuario_id: userId,
      realizado: null, // Apenas sessões pendentes
      data_atendimento: {
        [Op.between]: [startOfDay, endOfDay]
      }
    },
    include: [{
      model: client,
      as: 'cliente',
      attributes: ['client_id', 'nome', 'telefone']
    }],
    order: [['data_atendimento', 'ASC']]
  });
}

// Função para buscar apenas sessões realizadas por data
async function getSessoesRealizadas(userId, date) {
  const startOfDay = new Date(`${date}T00:00:00-03:00`);
  const endOfDay = new Date(`${date}T23:59:59-03:00`);

  return await sessao.findAll({
    where: {
      usuario_id: userId,
      realizado: true, // Apenas sessões realizadas
      data_atendimento: {
        [Op.between]: [startOfDay, endOfDay]
      }
    },
    include: [{
      model: client,
      as: 'cliente',
      attributes: ['client_id', 'nome', 'telefone']
    }],
    order: [['data_atendimento', 'DESC']]
  });
}

// Função para buscar apenas sessões canceladas por data
async function getSessoesCanceladas(userId, date) {
  const startOfDay = new Date(`${date}T00:00:00-03:00`);
  const endOfDay = new Date(`${date}T23:59:59-03:00`);

  return await sessao.findAll({
    where: {
      usuario_id: userId,
      realizado: false, // Apenas sessões canceladas
      data_atendimento: {
        [Op.between]: [startOfDay, endOfDay]
      }
    },
    include: [{
      model: client,
      as: 'cliente',
      attributes: ['client_id', 'nome', 'telefone']
    }],
    order: [['data_atendimento', 'DESC']]
  });
}

// Função para buscar sessões realizadas por data
async function getRealizadasByDate(userId, date) {
  const startOfDay = new Date(`${date}T00:00:00-03:00`);
  const endOfDay = new Date(`${date}T23:59:59-03:00`);

  return await sessao.findAll({
    where: {
      usuario_id: userId,
      realizado: true,
      data_atendimento: {
        [Op.between]: [startOfDay, endOfDay]
      }
    },
    include: [{
      model: client,
      as: 'cliente',
      attributes: ['client_id', 'nome', 'telefone']
    }],
    order: [['data_atendimento', 'DESC']]
  });
}

// Função para buscar sessões canceladas por data
async function getCanceladasByDate(userId, date) {
  const startOfDay = new Date(`${date}T00:00:00-03:00`);
  const endOfDay = new Date(`${date}T23:59:59-03:00`);

  return await sessao.findAll({
    where: {
      usuario_id: userId,
      realizado: false,
      data_atendimento: {
        [Op.between]: [startOfDay, endOfDay]
      }
    },
    include: [{
      model: client,
      as: 'cliente',
      attributes: ['client_id', 'nome', 'telefone']
    }],
    order: [['data_atendimento', 'DESC']]
  });
}

// Função para buscar sessões realizadas
async function getRealizadas(userId) {
  return await sessao.findAll({
    where: {
      usuario_id: userId,
      realizado: true
    },
    include: [{
      model: client,
      as: 'cliente',
      attributes: ['client_id', 'nome', 'telefone']
    }],
    order: [['data_atendimento', 'DESC']]
  });
}

// Função para buscar sessões canceladas
async function getCanceladas(userId) {
  return await sessao.findAll({
    where: {
      usuario_id: userId,
      realizado: false
    },
    include: [{
      model: client,
      as: 'cliente',
      attributes: ['client_id', 'nome', 'telefone']
    }],
    order: [['data_atendimento', 'DESC']]
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

module.exports = { 
  verifySession, 
  getAll, 
  getById, 
  getByClientId, 
  getByDate, 
  getSessoesPendentes,
  getSessoesRealizadas,
  getSessoesCanceladas,
  getSessoesPendentesByClient,
  getSessoesRealizadasByClient,
  getRealizadas, 
  getCanceladas, 
  getRealizadasByDate, 
  getCanceladasByDate, 
  changeStatus, 
  updateSession, 
  createSession, 
  deleteSession 
};
