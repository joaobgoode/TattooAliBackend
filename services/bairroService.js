const bairro = require('../models/bairro.js');

async function getAll() {
  return await bairro.findAll({ order: [['nome', 'ASC']] });
}

module.exports = { getAll };
