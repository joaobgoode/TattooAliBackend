const Client = require('../models/Client.js');

async function create(data) {
  return await Client.create(data);
}

async function getAll(user_id) {
  return await Client.findAll({ where: { user_id: user_id } });
}

async function getById(id) {
  return await Client.findByPk(id);
}

async function getByName(nome) {
  return await Client.findAll({
    where: { nome }
  });
}

async function update(id, data) {
  const clientInstance = await Client.findByPk(id);
  if (!clientInstance) return null;
  return await clientInstance.update(data);
}

async function remove(id) {
  const clientInstance = await Client.findByPk(id);
  if (!clientInstance) return null;
  return await clientInstance.destroy();
}

async function getByPhone(ClientTelefone) {
  return await Client.findOne({
    where: { telefone: ClientTelefone }
  });
}

async function belongsToUser(clientId, userId) {
  const client = await Client.findByPk(clientId);
  if (!client) return false;
  return client.user_id === userId;
}

module.exports = {
  create,
  getAll,
  getById,
  getByName,
  update,
  remove,
  getByPhone,
  belongsToUser
};
