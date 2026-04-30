const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');
const User = require('./user.js');
const Session = require('./Session.js');

const Notification = sequelize.define(
  'Notification',
  {
    notification_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sessao_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    tipo: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    titulo: {
      type: DataTypes.STRING(140),
      allowNull: false,
    },
    mensagem: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    lida: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: 'Notifications',
  },
);

Notification.belongsTo(User, { foreignKey: 'user_id' });
Notification.belongsTo(Session, { foreignKey: 'sessao_id' });

module.exports = Notification;
