const estudioService = require('../services/estudioService');
const { cnpj: cnpjValidator } = require('cpf-cnpj-validator');

function apenasDigitos(v) {
  return String(v ?? '').replace(/\D/g, '');
}

async function createEstudio(req, res) {
  const { nome, telefone, endereco, cnpj } = req.body;
  const cnpjDigitos = apenasDigitos(cnpj);

  if (!nome || !nome.trim()) {
    return res.status(400).json({ error: "Nome obrigatório" });
  }

  if (!cnpjDigitos || cnpjDigitos.length !== 14 || !cnpjValidator.isValid(cnpjDigitos)) {
    return res.status(400).json({ error: "CNPJ inválido" });
  }

  try {
    const novoEstudio = await estudioService.create({
      nome: nome.trim(),
      telefone: apenasDigitos(telefone),
      endereco,
      cnpj: cnpjDigitos,
      user_id: req.user.id,
    });
    return res.status(201).json(novoEstudio);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function getEstudios(req, res) {
  try {
    const estudios = await estudioService.getAll(req.user.id);
    return res.status(200).json(estudios);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function getEstudioById(req, res) {
  const { id } = req.params;
  try {
    const estudio = await estudioService.getById(id);
    if (!estudio) return res.status(404).json({ error: "Estúdio não encontrado" });
    return res.status(200).json(estudio);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function updateEstudio(req, res) {
  const { id } = req.params;
  const { nome, telefone, endereco, cnpj } = req.body;
  const cnpjDigitos = cnpj ? apenasDigitos(cnpj) : null;

  if (cnpjDigitos !== null && (!cnpjDigitos || cnpjDigitos.length !== 14 || !cnpjValidator.isValid(cnpjDigitos))) {
    return res.status(400).json({ error: "CNPJ inválido" });
  }

  try {
    const isOwner = await estudioService.belongsToUser(id, req.user.id);
    if (!isOwner) return res.status(404).json({ error: "Estúdio não encontrado ou não pertence ao usuário" });

    const payload = {};
    if (nome !== undefined) payload.nome = nome.trim();
    if (telefone !== undefined) payload.telefone = apenasDigitos(telefone);
    if (endereco !== undefined) payload.endereco = endereco;
    if (cnpjDigitos !== null) payload.cnpj = cnpjDigitos;

    const updated = await estudioService.update(id, payload);
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function deleteEstudio(req, res) {
  const { id } = req.params;
  try {
    const isOwner = await estudioService.belongsToUser(id, req.user.id);
    if (!isOwner) return res.status(404).json({ error: "Estúdio não encontrado ou não pertence ao usuário" });

    await estudioService.remove(id);
    return res.status(200).json({ message: "Estúdio removido com sucesso" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

module.exports = {
  createEstudio,
  getEstudios,
  getEstudioById,
  updateEstudio,
  deleteEstudio,
};