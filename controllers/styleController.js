const styleService = require('../services/styleService');

async function getAll(req, res) {
  const styles = await styleService.getAll();
  res.status(200).json(styles);
}

module.exports = { getAll };
