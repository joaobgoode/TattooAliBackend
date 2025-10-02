const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');

const User = require('./user');

const Client = sequelize.define('Client', {
  client_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descricao: {
    type: DataTypes.STRING
  },
  telefone: {
    type: DataTypes.STRING
  },
  endereco: {
    type: DataTypes.STRING,
    validate: {
      len: [0, 255]
    }
  }
});

Client.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Client;

