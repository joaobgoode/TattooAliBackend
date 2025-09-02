const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');
const bcrypt = require('bcrypt');

const Tatuador = sequelize.define('Tatuador', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
    }},
    senhaHasheada: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [8, 100] // Senha deve ter entre 8 e 100 caracteres
        }
    },
    data_criacao:{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
})

Tatuador.beforeCreate(async (tatuador, options) =>{
    tatuador.senhaHasheada = await bcrypt.hash(tatuador.senhaHasheada, 10);
});

module.exports = Tatuador;