const User = require('../models/user.js');
const Style = require('../models/style.js');
const Bairro = require('../models/bairro.js');
const Photo = require('../models/Photo.js');
const Review = require('../models/Review.js');
const Client = require('../models/Client.js');
const sequelize = require('../db/database.js');
const { fn, col, literal, Op } = require('sequelize');
const { styleNameILikePatterns, stylePatternsForSearchQuery } = require('./styleSearchPatterns.js');

require('../models/user_style.js');

async function exist(user_id) {
  const id = Number.parseInt(String(user_id), 10);
  if (!Number.isFinite(id) || id < 1) return false;
  const user = await User.findOne({
    where: { user_id: id, role: 'tatuador' },
  });
  return !!user;
}

async function getUserStyles(user_id) {
  const id = Number.parseInt(String(user_id), 10);
  if (!Number.isFinite(id) || id < 1) return [];
  const styles = await Style.findAll({
    attributes: ['id', 'nome'],
    include: [{
      model: User,
      attributes: [],
      where: { user_id: id },
      through: { attributes: [] }
    }]
  });
  return styles;
}

async function getUserPhotos(user_id) {
  const id = Number.parseInt(String(user_id), 10);
  if (!Number.isFinite(id) || id < 1) return [];
  const photos = await Photo.findAll({
    attributes: ['photo_id', 'url', 'titulo', 'descricao'],
    where: { user_Id: id },
    order: [['createdAt', 'DESC']]
  });
  return photos;
}

async function getUserReviews(user_id) {
  const id = Number.parseInt(String(user_id), 10);
  if (!Number.isFinite(id) || id < 1) return [];
  const reviews = await Review.findAll({
    attributes: ['review_id', 'usuario_id', 'cliente_id', 'data_sessao', 'nota', 'comentario'],
    where: { usuario_id: id },
    include: [
      {
        model: Client,
        as: 'cliente',
        attributes: ['client_id', 'nome'],
        required: false,
      },
    ],
    order: [['createdAt', 'DESC']],
  });
  return reviews;
}

async function getUsersByBairro(bairro_id) {
  const users = await User.findAll({
    where: {
      bairro_id: bairro_id
    },
    attributes: [
      'user_id',
      'nome',
      'sobrenome',
      'bairro_id',
      [fn('AVG', col('Reviews.nota')), 'media'],
      [fn('COUNT', col('Reviews.review_id')), 'qtd']
    ],
    include: [
      {
        model: Review,
        as: 'Reviews',
        attributes: []
      }
    ],
    group: ['User.user_id', 'User.nome', 'User.sobrenome', 'User.bairro_id'],
    order: [
      [literal('"media"'), 'DESC'],
      [literal('"qtd"'), 'DESC']
    ]
  });
  return users;
}

async function getUserPerfil(user_id) {
  const id = Number.parseInt(String(user_id), 10);
  if (!Number.isFinite(id) || id < 1) return null;
  const user = await User.findOne({
    where: { user_id: id, role: 'tatuador' },
    include: [
      { model: Bairro, attributes: ['id', 'nome'], required: false },
    ],
  });
  return user;
}

/**
 * Lista tatuadores para busca (app cliente). Filtro opcional por texto e por nome de estilo.
 */
async function searchTatuadores({ q = '', estilo = 'Todos' } = {}) {
  const where = { role: 'tatuador' };
  const term = String(q || '').trim();
  if (term) {
    const like = `%${term}%`;
    const stylePatterns = stylePatternsForSearchQuery(term);
    const styleMatchSql = stylePatterns
      .map((p) => `s.nome ILIKE ${sequelize.escape(p)}`)
      .join(' OR ');
    where[Op.or] = [
      { nome: { [Op.iLike]: like } },
      { sobrenome: { [Op.iLike]: like } },
      { bio: { [Op.iLike]: like } },
      { endereco: { [Op.iLike]: like } },
      literal(`EXISTS (
        SELECT 1 FROM "Bairros" AS b
        WHERE b.id = "User"."bairro_id"
        AND b.nome ILIKE ${sequelize.escape(like)}
      )`),
      literal(`EXISTS (
        SELECT 1 FROM "UserStyles" AS us
        INNER JOIN "Styles" AS s ON s.id = us."StyleId"
        WHERE us."UserUserId" = "User"."user_id"
        AND (${styleMatchSql})
      )`),
    ];
  }

  const styleInclude = {
    model: Style,
    attributes: ['id', 'nome'],
    through: { attributes: [] },
    required: false,
  };
  const estiloTrim = String(estilo || '').trim();
  if (estiloTrim && estiloTrim.toLowerCase() !== 'todos') {
    const estiloPatterns = styleNameILikePatterns(estiloTrim);
    styleInclude.where = {
      [Op.or]: estiloPatterns.map((p) => ({ nome: { [Op.iLike]: p } })),
    };
    styleInclude.required = true;
  }

  const users = await User.findAll({
    where,
    attributes: [
      'user_id',
      'nome',
      'sobrenome',
      'bio',
      'endereco',
      'telefone',
      'instagram',
      'foto',
      'bairro_id',
    ],
    include: [
      styleInclude,
      { model: Bairro, attributes: ['id', 'nome'], required: false },
    ],
    order: [
      ['nome', 'ASC'],
      ['sobrenome', 'ASC'],
    ],
    distinct: true,
  });

  const ids = users.map((u) => u.user_id);
  let ratingMap = {};
  if (ids.length > 0) {
    const avgs = await Review.findAll({
      attributes: ['usuario_id', [fn('AVG', col('nota')), 'media']],
      where: { usuario_id: { [Op.in]: ids } },
      group: ['usuario_id'],
      raw: true,
    });
    ratingMap = Object.fromEntries(
      avgs.map((r) => [
        r.usuario_id,
        Math.round(parseFloat(r.media) * 10) / 10,
      ]),
    );
  }

  return users.map((u) => {
    const plain = u.get({ plain: true });
    const styleRows = plain.Styles || plain.styles || [];
    const styles = styleRows.map((s) => s.nome).filter(Boolean);
    const bairroNome = plain.Bairro?.nome ?? null;
    return {
      user_id: plain.user_id,
      nome: plain.nome,
      sobrenome: plain.sobrenome,
      bio: plain.bio || '',
      endereco: plain.endereco || '',
      telefone: plain.telefone,
      instagram: plain.instagram,
      foto: plain.foto,
      bairro_id: plain.bairro_id,
      bairro_nome: bairroNome,
      styles,
      avg_rating: ratingMap[plain.user_id] ?? null,
    };
  });
}

module.exports = {
  getUserStyles,
  getUserPhotos,
  getUserReviews,
  getUsersByBairro,
  exist,
  getUserPerfil,
  searchTatuadores,
};
