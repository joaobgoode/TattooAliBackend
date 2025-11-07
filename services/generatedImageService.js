const GeneratedImage = require('../models/GeneratedImage');

async function createImage(data) {
  return await GeneratedImage.create(data);
}

async function getImageById(image_id) {
  return await GeneratedImage.findByPk(image_id);
}

async function getAll(user_id) {
  return await GeneratedImage.findAll({ where: { user_id: user_id } });
}

async function deleteImage(image_id) {
  const image = await getImageById(image_id);
  if (!image) {
    return false;
  }
  const ok = await image.destroy();
  return !!ok
}

async function belongsToUser(image_id, user_id){
    const image = await GeneratedImage.findOne({ where: { user_id: user_id, image_id: image_id} });
    return !!image
}

module.exports = {
  createImage,
  getImageById,
  deleteImage,
  getAll,
  belongsToUser
};
