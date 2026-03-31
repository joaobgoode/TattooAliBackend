const bairro = require('../models/bairro.js');

async function getAll() {
  return await bairro.findAll();
}

module.exports = { getAll };
