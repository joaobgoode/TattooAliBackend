const User = require('../models/user.js');

async function create(data) {
  return await User.create(data);
}

async function getAll() {
  return await User.findAll();
}

async function getById(id) {
  return await User.findByPk(id);
}

async function update(id, data) {
  const User = await User.findByPk(id);
  if (!User) return null;
  return await User.update(data);
}

async function remove(id) {
  const User = await User.findByPk(id);
  if (!User) return null;
  return await User.destroy();
}

async function getByEmail(userEmail) {
  return await User.findOne({
    where: { email: userEmail }
  })
}

module.exports = { create, getAll, getById, update, remove, getByEmail };
