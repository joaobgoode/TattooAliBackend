const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');
const User = require('./user');

const Bairro = sequelize.define('Bairro', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timestamps: false
})

Bairro.hasMany(User, {
  foreignKey: 'bairro_id'
})

User.belongsTo(Bairro, {
  foreignKey: 'bairro_id'
})


module.exports = Bairro;

