const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sobrenome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  bio: {
    type: DataTypes.STRING,
  },
  cpf: {
    type: DataTypes.STRING,
    allowNull: false
  },
  endereco: DataTypes.STRING,
  telefone: DataTypes.STRING,
  whatsapp: DataTypes.STRING,
  instagram: DataTypes.STRING,
  especialidades: DataTypes.STRING,
  foto: DataTypes.STRING,
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
      len: [8, 100] // Senha deve ter entre 8 e 100 caracteres
    }
  }
})

User.beforeCreate(async (user, options) => {
  user.senha = await bcrypt.hash(user.senha, 10);
});

module.exports = User;
