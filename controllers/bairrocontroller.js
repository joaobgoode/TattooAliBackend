const bairroService = require('../services/bairroService');

async function getAll(req, res) {
  try {
    const bairros = await bairroService.getAll();
    res.status(200).json(bairros);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao recuperar os bairros.' });
  }
}

module.exports = { getAll };
