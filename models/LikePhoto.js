const { DataTypes } = require("sequelize");
const sequelize = require("../db/database.js");
const User = require("./user.js");
const Photo = require("./Photo.js");

const LikePhoto = sequelize.define("LikePhoto",
  {
    like_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "usuario_id",
      },
    },
    photo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Photo,
        key: "photo_id",
      },
    },
  },
  {
    tableName: "PhotoLikes",
    indexes: [
      {
        unique: true,
        fields: ["user_id", "photo_id"],
      },
    ],
    timestamps: true,
  },
);

LikePhoto.belongsTo(User, { foreignKey: "user_id", as: "user" });
LikePhoto.belongsTo(Photo, { foreignKey: "photo_id", as: "photo" });

module.exports = LikePhoto;
