const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');
const client = require('./Client.js');
const User = require('./user.js');

const Session = sequelize.define('Sessao', {
    sessao_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    data_atendimento: {
        type: DataTypes.DATE,
        allowNull: false
    },
    valor_sessao: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    numero_sessao: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    descricao: {
        type: DataTypes.STRING,
    },
    realizado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

Session.belongsTo(client, { foreignKey: 'cliente_id'});
Session.belongsTo(User, { foreignKey: 'usuario_id' });

module.exports = Session;