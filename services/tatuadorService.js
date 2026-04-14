const User = require('../models/user.js');
const Style = require('../models/style.js');
const Photo = require('../models/Photo.js');
const Review = require('../models/Review.js');
const { fn, col, literal } = require('sequelize');

require('../models/user_style.js');

async function exist(user_id) {
  const user = await User.findOne({
    where: { user_id: user_id, role: 'tatuador' }
  })
  return !!user
}

async function getUserStyles(user_id) {
  const styles = await Style.findAll({
    attributes: ['id', 'nome'],
    include: [{
      model: User,
      attributes: [],
      where: { user_id },
      through: { attributes: [] }
    }]
  });
  return styles;
}

async function getUserPhotos(user_id) {
  const photos = await Photo.findAll({
    attributes: ['photo_id', 'url', 'titulo', 'descricao'],
    where: { user_Id: user_id },
    order: [['createdAt', 'DESC']]
  });
  return photos;
}

async function getUserReviews(user_id) {
  const reviews = await Review.findAll({
    attributes: ['review_id', 'usuario_id', 'data_sessao', 'nota', 'comentario'],
    where: { usuario_id: user_id },
    order: [['createdAt', 'DESC']]
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
  const user = await User.findOne({
    where: { user_id, role: 'tatuador' }
  });
  return user;
}


module.exports = { getUserStyles, getUserPhotos, getUserReviews, getUsersByBairro, exist, getUserPerfil };
