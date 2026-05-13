const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');

const User = require('./user');
const Review = require('./Review');

const Estudio = sequelize.define('Estudio', {
    estudio_id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    telefone: {
        type: DataTypes.STRING,
    },
    endereco: {
        type: DataTypes.STRING,
        validate: {
        len: [0, 255],
        },
    },
    cnpj: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
});

Estudio.belongsTo(User, { foreignKey: 'user_id' });
Estudio.hasMany(Review, { foreignKey: "user_id", as: "Reviews" });