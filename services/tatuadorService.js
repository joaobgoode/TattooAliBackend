const User = require('../models/user.js');
const Style = require('../models/style.js');
const Photo = require('../models/Photo.js');
const Review = require('../models/Review.js');
import { fn, col, literal } from 'sequelize'


async function exist(user_id) {
  const user = await User.findOne({
    where: { user_id: user_id, role: 'tatuador' }
  })
  return !!user
}

async function getUserStyles(user_id) {
  const styles = await Style.findAll({
    attributes: ['id', 'name'],
    include: [{
      model: UserStyle,
      attributes: [],
      where: { user_id: userId }
    }]
  })
  return styles;
}

async function getUserPhotos(user_id) {
  const photos = await Photo.findAll({
    attributes: ['photo_id', 'url', 'titulo', 'descricao'],
    where: { user_id: user_id },
    order: [['created_at', 'DESC']]
  })
  return photos
}

async function getUserReviews(user_id) {
  const reviews = await Review.findAll({
    attributes: ['id', 'user_id', 'tattoo_id', 'rating', 'comment'],
    where: { tatuador: user_id },
    order: [['created_at', 'DESC']]
  })
  return reviews
}

async function getUsersByBairro(bairro_id) {
  const users = await User.findAll({
    where: {
      bairro_id: bairro_id
    },
    attributes: [
      'id',
      'name',
      [fn('AVG', col('Reviews.rating')), 'media'],
      [fn('COUNT', col('Reviews.id')), 'qtd']
    ],
    include: [
      {
        model: Review,
        attributes: []
      }
    ],
    group: ['User.id', 'User.name', 'User.bairro'],
    order: [
      [literal('"media"'), 'DESC'],
      [literal('"qtd"'), 'DESC']
    ]
  })
  return users
}

async function getUserPerfil(user_id) {
  const user = await User.findOne({
    user_id: user_id,
    role: 'tatuador'
  })
  return user
}


module.exports = { getUserStyles, getUserPhotos, getUserReviews, getUsersByBairro, exist, getUserPerfil };
