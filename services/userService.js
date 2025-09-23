const User = require('../models/user.js');

async function create(data) {
  return await User.create(data);
}

async function getById(id) {
  return await User.findByPk(id);
}


async function updateImage(id, path) {
  const user = await User.findByPk(id);
  if (!user) return null;
  return await User.update({ foto: path }, { where: { user_id: id } });
}

async function getByEmail(userEmail) {
  return await User.findOne({
    where: { email: userEmail }
  })
}

module.exports = { create, getById, getByEmail, updateImage };
