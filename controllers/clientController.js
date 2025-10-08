const clientService = require('../services/clientService');

function validarNome(nome) {
  return typeof nome === 'string' && nome.length >= 5 && nome.length <= 50;
}

function validarTelefone(telefone) {
  const regex = /^[0-9]+$/; // só números
  return typeof telefone === 'string' && regex.test(telefone);
}

function validarDescricao(descricao) {
  return !descricao || descricao.length <= 480;
}

function validarEndereco(endereco) {
  return !endereco || endereco.length <= 480;
}


//Criar cliente
async function createClient(req, res) {
  const { nome, telefone, descricao, endereco } = req.body;

  if (!nome) {
    return res.status(400).json({ error: "Campos obrigatórios em branco" });
  }

  if (!validarNome(nome) || !validarTelefone(telefone) || !validarDescricao(descricao) || !validarEndereco(endereco)) {
    return res.status(400).json({ error: "Campos inválidos" });
  }

  const user_id = req.user.id;

  try {
    const novoCliente = { nome, telefone, descricao, user_id, endereco };
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
      const client = await clientService.getByPhone(telefone);
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
      return res.status(403).json({ error: "Acesso negado" });
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
  const { nome, telefone, descricao, endereco } = req.body;
  const user_id = req.user.id;

  if ((nome && !validarNome(nome)) || (telefone && !validarTelefone(telefone)) || (descricao && !validarDescricao(descricao)) || (endereco && !validarEndereco(endereco))) {
    return res.status(400).json({ error: "Campos inválidos" });
  }

  try {
    const isOwner = await clientService.belongsToUser(id, user_id);
    if (!isOwner) {
      return res.status(403).json({ error: "Acesso negado" });
    }
    const updated = await clientService.update(id, { nome, telefone, descricao, endereco });
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
      return res.status(403).json({ error: "Acesso negado" });
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

module.exports = {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient
};
