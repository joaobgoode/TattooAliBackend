const { DataTypes } = require("sequelize");
const sequelize = require("../db/database");
const client = require("./Client.js");
const User = require("./user.js");

const Report = sequelize.define("Denuncia", {
  denuncia_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  descricao: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 500],
    },
  },
  status: {
    type: DataTypes.STRING,
    enum: ["pendente", "analisando", "resolvida", "rejeitada"],
    default: "pendente",
  },
  denunciante: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  denunciado: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  moderador: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Report.belongsTo(client, { foreignKey: "cliente_id", as: "client" });
Report.belongsTo(User, { foreignKey: "usuario_id" });

module.exports = Report;
