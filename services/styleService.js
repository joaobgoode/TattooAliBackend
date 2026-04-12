const style = require('../models/style.js');

/** Lista inicial se o banco ainda não tiver estilos (evita GET vazio e modal sem opções). */
const DEFAULT_STYLE_NAMES = [
  'Realismo',
  'Tribal',
  'Floral',
  'Blackwork',
  'Aquarela',
  'Neotrad',
  'Old School',
  'Pontilhismo',
  'Geométrico',
  'Japonês',
  'Lettering',
  'Maori',
  'Biomecânico',
];

async function getAll() {
  const rows = await style.findAll({ order: [['nome', 'ASC']] });
  if (rows.length > 0) {
    return rows;
  }
  await style.bulkCreate(DEFAULT_STYLE_NAMES.map((nome) => ({ nome })));
  return style.findAll({ order: [['nome', 'ASC']] });
}

module.exports = { getAll };
