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
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [8, 100] 
    }
  },
  cpf:{
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
});

Client.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Client;

