const style = require('../models/style.js');

async function getAll() {
  return await style.findAll();
}

module.exports = { getAll };
