const clientService = require('../services/clientService');
const { cpf: cpfValidator } = require('cpf-cnpj-validator');

function apenasDigitos(v) {
  return String(v ?? '').replace(/\D/g, '');
}

function validarNome(nome) {
  return typeof nome === 'string' && nome.trim().length >= 5 && nome.trim().length <= 50;
}

/** Aceita número com ou sem máscara; valida após remover tudo que não é dígito. */
function validarTelefoneDigitos(digitos) {
  return typeof digitos === 'string' && digitos.length >= 10 && digitos.length <= 13;
}

function validarDescricao(descricao) {
  return !descricao || descricao.length <= 480;
}

function validarEndereco(endereco) {
  return !endereco || endereco.length <= 480;
}


//Criar cliente
async function createClient(req, res) {
  const { nome, descricao, endereco } = req.body;
  const telefoneDigitos = apenasDigitos(req.body.telefone);
  const cpfDigitos = apenasDigitos(req.body.cpf);

  if (!nome || !nome.trim()) {
    return res.status(400).json({ error: "Campos obrigatórios em branco" });
  }

  if (!cpfDigitos || cpfDigitos.length !== 11 || !cpfValidator.isValid(cpfDigitos)) {
    return res.status(400).json({ error: "CPF inválido. Informe os 11 dígitos (com ou sem máscara)." });
  }

  if (!validarNome(nome)) {
    return res.status(400).json({ error: "Nome inválido: use entre 5 e 50 caracteres." });
  }

  if (!validarTelefoneDigitos(telefoneDigitos)) {
    return res.status(400).json({
      error: "Telefone inválido: informe DDD + número (ex.: 11999998888 ou com máscara).",
    });
  }

  if (!validarDescricao(descricao) || !validarEndereco(endereco)) {
    return res.status(400).json({ error: "Descrição ou endereço excede o tamanho permitido." });
  }

  const user_id = req.user.id;

  try {
    const novoCliente = {
      nome: nome.trim(),
      telefone: telefoneDigitos,
      cpf: cpfDigitos,
      descricao,
      user_id,
      endereco: endereco || '',
    };
    const novoRegistro = await clientService.create(novoCliente);
    return res.status(201).json(novoRegistro);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

//Listar clientes
async function getClients(req, res) {
  const { nome, telefone } = req.query;
  try {
    if (nome) {
      const clients = await clientService.getByName(nome);
      return res.status(200).json(clients);
    }
    if (telefone) {
      const client = await clientService.getByPhone(apenasDigitos(telefone));
      return res.status(200).json(client);
    }
    const user_id = req.user.id;
    const clients = await clientService.getAll(user_id);
    return res.status(200).json(clients);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

//Buscar cliente específico
async function getClientById(req, res) {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    const isOwner = await clientService.belongsToUser(id, user_id);
    if (!isOwner) {
      return res.status(404).json({ error: "Cliente não encontrado ou não pertence ao usuario" });
    }
    const client = await clientService.getById(id);
    if (!client) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }
    return res.status(200).json(client);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

// Atualizar cliente
async function updateClient(req, res) {
  const { id } = req.params;
  const { nome, telefone, descricao, endereco, cpf } = req.body;
  const user_id = req.user.id;

  const telefoneDigitos = telefone != null && telefone !== '' ? apenasDigitos(telefone) : null;
  const cpfDigitos = cpf != null && cpf !== '' ? apenasDigitos(cpf) : null;

  if (nome && !validarNome(nome)) {
    return res.status(400).json({ error: "Nome inválido: use entre 5 e 50 caracteres." });
  }
  if (cpfDigitos !== null) {
    if (cpfDigitos.length !== 11 || !cpfValidator.isValid(cpfDigitos)) {
      return res.status(400).json({ error: "CPF inválido." });
    }
  }
  if (telefoneDigitos !== null && !validarTelefoneDigitos(telefoneDigitos)) {
    return res.status(400).json({
      error: "Telefone inválido: informe DDD + número (ex.: 11999998888 ou com máscara).",
    });
  }
  if (descricao && !validarDescricao(descricao)) {
    return res.status(400).json({ error: "Descrição excede o tamanho permitido." });
  }
  if (endereco && !validarEndereco(endereco)) {
    return res.status(400).json({ error: "Endereço excede o tamanho permitido." });
  }

  try {
    const isOwner = await clientService.belongsToUser(id, user_id);
    if (!isOwner) {
      return res.status(404).json({ error: "Cliente não encontrado ou não pertence ao usuario" });
    }
    const payload = {};
    if (nome !== undefined) payload.nome = nome.trim();
    if (telefoneDigitos !== null) payload.telefone = telefoneDigitos;
    if (cpfDigitos !== null) payload.cpf = cpfDigitos;
    if (descricao !== undefined) payload.descricao = descricao;
    if (endereco !== undefined) payload.endereco = endereco;
    const updated = await clientService.update(id, payload);
    if (!updated) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

// Deletar cliente
async function deleteClient(req, res) {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    const isOwner = await clientService.belongsToUser(id, user_id);
    if (!isOwner) {
      return res.status(404).json({ error: "Cliente não encontrado ou não pertence ao usuario" });
    }
    const removed = await clientService.remove(id);
    if (!removed) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }
    return res.status(200).json({ message: "Cliente removido com sucesso" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function registerNewClient(req, res) {
  try {
    const client = await clientService.registerClient(req.body);
    res.status(201).json(client);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
  registerNewClient
};
