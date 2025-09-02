const userService = require('../services/userService');

async function create(req, res) {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) {
    return res.status(400).json({ error: "Campos obrigatórios em branco" });
  }
  const senhaHasheada = senha
  try {
    await userService.create({ nome, email, senhaHasheada });
    res.status(201).json({ message: "Usuário criado com sucesso" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function getAll(req, res) {
  try {
    const users = await userService.getAll();
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function getById(req, res) {
  const { id } = req.params;
  try {
    const user = await userService.getById(id);
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function update(req, res) {
  const { id } = req.params;
  try {
    const newData = {}
    const { nome, email, senha } = req.body;
    if (nome) newData.nome = nome;
    if (email) newData.email = email;
    if (senha) newData.senha = senha;
    const user = await userService.update(id, newData);
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function remove(req, res) {
  const { id } = req.params;
  try {
    const deleted = await userService.remove(id);
    if (!deleted) return res.status(404).json({ error: "Usuário não encontrado" });
    res.status(200).json({ message: "Usuário excluído com sucesso" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = { create, getAll, getById, update, remove };
