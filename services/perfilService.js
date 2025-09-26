const User = require('../models/user');
const Style = require('../models/style');
const sequelize = require('../db/database.js');

async function getPerfilById(id) {
  const user = await User.findByPk(id, { include: [Style] });
  return user;
}

async function deletePerfilById(id) {
  const user = await User.findByPk(id);
  if (!user) {
    throw new Error('Perfil não encontrado');
  }
  await user.destroy();
}

async function updatePerfil(id, dataPerfil, estilos) {
  const user = await User.findByPk(id);
  if (!user) {
    throw new Error('Perfil não encontrado');
  }
  return await sequelize.transaction(async (t) => {

    await user.update(dataPerfil, { transaction: t });

    await user.setStyles(estilos, { transaction: t });

    return await User.findByPk(id, { include: [Style] });
  })
}

module.exports = { getPerfilById, deletePerfilById, updatePerfil };
