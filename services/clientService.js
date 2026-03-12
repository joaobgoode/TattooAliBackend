const Client = require('../models/Client.js');
const { Op, fn, col, where } = require('sequelize');
const { cpf } = require('cpf-cnpj-validator');
const bcrypt = require('bcrypt');

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
    where: where(
      fn('unaccent', col('nome')),
      {
        [Op.iLike]: `%${nome}%`
      }
    )
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

async function registerClient({ nome, email, senha, cpf: clientCpf, user_id}){
  if(!cpf.isValid(clientCpf)){
    throw new Error('CPF inválido');
  }

  const existingClient = await Client.findOne({
    where: {
      [Op.or]: [
        {email: email},
        {cpf: clientCpf}
      ]
    }
  });

  if (existingClient){
    throw new Error ('Email ou CPF já cadastrado');
  }

  const hashedPassword = await bcrypt.hash(senha, 10);

  const newClient = await Client.create({
    nome,
    email,
    senha: hashedPassword,
    cpf: clientCpf,
    user_id
  });

  return newClient;                                             
}

module.exports = {
  create,
  getAll,
  getById,
  getByName,
  update,
  remove,
  getByPhone,
  belongsToUser,
  registerClient
};
