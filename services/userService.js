const Tatuador = require('../models/tatuador.js');

async function create(data) {
  return await Tatuador.create(data);
}

async function getAll() {
  return await Tatuador.findAll();
}

async function getById(id) {
  return await Tatuador.findByPk(id);
}

async function update(id, data) {
  const tatuador = await Tatuador.findByPk(id);
  if (!tatuador) return null;
  return await tatuador.update(data);
}

async function remove(id) {
  const tatuador = await Tatuador.findByPk(id);
  if (!tatuador) return null;
  return await tatuador.destroy();
}

module.exports = { create, getAll, getById, update, remove };
