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

async function updatePerfil(id, dataPerfil, estilosIds) {
  const user = await User.findByPk(id);
  if (!user) {
    throw new Error('Perfil não encontrado');
  }

  return await sequelize.transaction(async (t) => {
    await user.update(dataPerfil, { transaction: t });

    if (estilosIds) {
      await user.setStyles(estilosIds, { transaction: t });
    }

    return await User.findByPk(id, { include: [Style], transaction: t });
  });
}

async function updateImage(userId, imagePath) {
  const user = await User.findByPk(userId);
  return await user.update({ foto: imagePath });
}

module.exports = { getPerfilById, deletePerfilById, updatePerfil, updateImage };
