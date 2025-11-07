const { DataTypes } = require('sequelize');
const sequelize = require('../db/database.js');
const User = require('./user.js');

const GeneratedImage = sequelize.define('GeneratedImage', {
  image_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

GeneratedImage.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = GeneratedImage;