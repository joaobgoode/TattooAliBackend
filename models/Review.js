const { DataTypes } = require("sequelize");
const sequelize = require("../db/database.js");
const User = require("./user.js");
const client = require("./Client.js");

const Review = sequelize.define("Review", {
  review_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  data_sessao: {
    type: "TIMESTAMP WITHOUT TIME ZONE",
    allowNull: false,
    get() {
      const raw = this.getDataValue("data_sessao");
      if (!raw) return null;
      return raw
        .toLocaleString("sv-SE", { timeZone: "America/Sao_Paulo" })
        .replace(" ", "T");
    },
  },
  nota: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
  comentario: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Review.belongsTo(client, { foreignKey: "cliente_id", as: "cliente" });
Review.belongsTo(User, { foreignKey: "usuario_id", as: "tatuador" });

module.exports = Review;
