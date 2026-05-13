const Estudio = require('../models/Estudio.js')
const User = require('../models/user.js');


async function createEstudio(data) {
    return await Estudio.create(data)
}

async function getAllEstudios(user_id){
    return await Estudio.findAll({where: {user_id}});
}

async function getEstudioById(id) {
    return await Estudio.findByPk(id);
}

async function belongsToUser(id, user_id) {
  const row = await Estudio.findOne({ where: { estudio_id: id, user_id } });
  return !!row;
}

async function updateImage(id, path) {
  const estudio = await Estudio.findByPk(id);
  if (!estudio) return null;
  await estudio.update({ foto: path });
  return estudio;
}

async function deleteEstudio(id) {
  const estudio = await Estudio.findByPk(id);
  if (!estudio) return null;
  await estudio.destroy();
  return estudio;
}

module.exports = { createEstudio, getAllEstudios, getEstudioById, updateImage, deleteEstudio, belongsToUser }