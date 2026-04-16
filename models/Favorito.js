const { DataTypes } = require("sequelize");
const sequelize = require("../db/database.js");
const User = require("./user.js");

const Favorito = sequelize.define(
  "Favorito",
  {
    favorito_id: {
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
    favoritado_id: {
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
    tableName: "Favoritos",
    indexes: [
      {
        unique: true,
        fields: ["cliente_id", "favoritado_id"],
      },
    ],
  }
);

Favorito.belongsTo(User, { foreignKey: "cliente_id", as: "cliente" });
Favorito.belongsTo(User, { foreignKey: "favoritado_id", as: "favoritado" });

module.exports = Favorito;
