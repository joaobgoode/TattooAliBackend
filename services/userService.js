const User = require('../models/user.js');
const UserStyle = require("../models/user_style.js")

async function create(data) {
  return await User.create(data);
}

async function getById(id) {
  return await User.findByPk(id);
}


async function updateImage(id, path) {
  const user = await User.findByPk(id);
  if (!user) return null;
  await user.update({ foto: path });
  return user;
}

async function getByEmail(userEmail) {
  return await User.findOne({
    where: { email: userEmail }
  })
}

async function getByCpf(cpf) {
  const digits = String(cpf || '').replace(/\D/g, '');
  if (!digits) return null;
  return await User.findOne({ where: { cpf: digits } });
}

module.exports = { create, getById, getByEmail, getByCpf, updateImage };
