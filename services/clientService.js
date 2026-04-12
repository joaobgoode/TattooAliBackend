const Client = require('../models/Client.js');
const User = require('../models/user.js');
const { Op, fn, col, where } = require('sequelize');
const { cpf } = require('cpf-cnpj-validator');

function cpfSoDigitos(v) {
  return String(v ?? '').replace(/\D/g, '');
}

function telefoneSoDigitos(v) {
  if (v == null || v === '') return null;
  return String(v).replace(/\D/g, '');
}

/**
 * Quando o tatuador atualiza o cadastro na agenda (Clients), espelha nome/sobrenome
 * na conta de app com mesmo CPF (Users, role cliente) para o mobile não ficar defasado.
 */
async function syncClienteUserFromClientRow(clientRow) {
  if (!clientRow) return;
  const cpfNorm = cpfSoDigitos(clientRow.cpf);
  if (!cpfNorm || cpfNorm.length !== 11) return;
  const clienteUser = await User.findOne({
    where: { cpf: cpfNorm, role: 'cliente' },
  });
  if (!clienteUser) return;

  const patch = {};
  const full = String(clientRow.nome || '').trim();
  if (full) {
    const parts = full.split(/\s+/).filter(Boolean);
    patch.nome = parts[0] || full;
    patch.sobrenome = parts.length > 1 ? parts.slice(1).join(' ') : '';
  }
  const tel = telefoneSoDigitos(clientRow.telefone);
  if (tel) patch.telefone = tel;
  const addr = String(clientRow.endereco || '').trim();
  if (addr) patch.endereco = addr.slice(0, 255);
  if (clientRow.descricao !== undefined && clientRow.descricao !== null) {
    patch.bio = String(clientRow.descricao).trim().slice(0, 480);
  }

  if (Object.keys(patch).length === 0) return;
  await clienteUser.update(patch);
}

/** Cliente da agenda (tatuador): nome, telefone, CPF, etc. */
async function create(data) {
  const cpfNorm = cpfSoDigitos(data.cpf);
  if (!cpf.isValid(cpfNorm)) {
    throw new Error('CPF inválido');
  }
  const dup = await Client.findOne({
    where: { user_id: data.user_id, cpf: cpfNorm },
  });
  if (dup) {
    throw new Error('Já existe um cliente com este CPF na sua lista.');
  }
  const row = await Client.create({
    nome: data.nome,
    telefone: data.telefone,
    descricao: data.descricao ?? null,
    endereco: data.endereco ?? '',
    user_id: data.user_id,
    cpf: cpfNorm,
  });
  await syncClienteUserFromClientRow(row);
  return row;
}

/**
 * Registro de cliente vinculado a um tatuador (ex.: mobile, após Supabase Auth).
 * Login fica fora desta tabela — sem email/senha em Clients.
 */
async function registerClient({ nome, cpf: clientCpf, user_id, telefone, descricao, endereco }) {
  const cpfNorm = cpfSoDigitos(clientCpf);
  if (!cpf.isValid(cpfNorm)) {
    throw new Error('CPF inválido');
  }

  const existingClient = await Client.findOne({
    where: { user_id, cpf: cpfNorm },
  });

  if (existingClient) {
    throw new Error('CPF já cadastrado para este tatuador');
  }

  const row = await Client.create({
    nome,
    telefone: telefoneSoDigitos(telefone),
    descricao: descricao ?? null,
    endereco: endereco ?? '',
    cpf: cpfNorm,
    user_id,
  });
  await syncClienteUserFromClientRow(row);
  return row;
}

async function getAll(user_id) {
  const rows = await Client.findAll({ where: { user_id: user_id } });
  const out = [];
  for (const row of rows) {
    const j = row.toJSON();
    const cpfNorm = cpfSoDigitos(j.cpf);
    let cliente_app_user_id = null;
    if (cpfNorm.length === 11) {
      const u = await User.findOne({
        where: { cpf: cpfNorm, role: 'cliente' },
        attributes: ['user_id'],
      });
      if (u) cliente_app_user_id = u.user_id;
    }
    out.push({ ...j, cliente_app_user_id });
  }
  return out;
}

async function getById(id) {
  return await Client.findByPk(id);
}

async function getByName(nome) {
  return await Client.findAll({
    where: where(
      fn('unaccent', col('nome')),
      {
        [Op.iLike]: `%${nome}%`,
      },
    ),
  });
}

async function update(id, data) {
  const clientInstance = await Client.findByPk(id);
  if (!clientInstance) return null;
  if (data.cpf !== undefined && data.cpf !== null) {
    const conflict = await Client.findOne({
      where: {
        user_id: clientInstance.user_id,
        cpf: data.cpf,
        client_id: { [Op.ne]: Number(id) },
      },
    });
    if (conflict) {
      throw new Error('Outro cliente seu já usa este CPF.');
    }
  }
  const updated = await clientInstance.update(data);
  await syncClienteUserFromClientRow(updated);
  return updated;
}

async function remove(id) {
  const clientInstance = await Client.findByPk(id);
  if (!clientInstance) return null;
  return await clientInstance.destroy();
}

async function getByPhone(ClientTelefone) {
  return await Client.findOne({
    where: { telefone: ClientTelefone },
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
  belongsToUser,
  registerClient,
};
