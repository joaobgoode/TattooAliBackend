const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');

const Style = sequelize.define('Style', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: false
})

module.exports = Style;
