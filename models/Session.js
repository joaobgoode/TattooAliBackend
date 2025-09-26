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
    type: "TIMESTAMP WITHOUT TIME ZONE",
    allowNull: false,
    get() {
      const raw = this.getDataValue('data_atendimento');
      if (!raw) return null;
      return raw.toLocaleString('sv-SE', { timeZone: 'America/Sao_Paulo' }).replace(' ', 'T');
    }
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

module.exports = Session;
