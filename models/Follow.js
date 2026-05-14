const { DataTypes } = require("sequelize");
const sequelize = require("../db/database.js");
const User = require("./user.js");

const Follow = sequelize.define(
  "Follow",
  {
    follow_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cliente_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "user_id",
      },
    },
    tatuador_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "user_id",
      },
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "Follows",
    indexes: [
      {
        unique: true,
        fields: ["cliente_id", "tatuador_id"],
      },
    ],
  }
);

Follow.belongsTo(User, { foreignKey: "cliente_id", as: "cliente" });
Follow.belongsTo(User, { foreignKey: "tatuador_id", as: "tatuador" });

module.exports = Follow;
