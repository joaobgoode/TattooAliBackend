const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');
const bcrypt = require('bcryptjs');

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
  
  foto: {
    type: DataTypes.STRING,
    get() {
      const rawValue = this.getDataValue('foto');
      return rawValue ? `${process.env.PUBLIC_BUCKET_URL}/${rawValue}` : null;
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
  }
});

User.beforeCreate(async (user, options) => {
  user.senha = await bcrypt.hash(user.senha, 10);
});

module.exports = User;
