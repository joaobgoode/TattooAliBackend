const { DataTypes } = require("sequelize");
const sequelize = require("../db/database");
const client = require("./Client.js");
const User = require("./user.js");

const Report = sequelize.define("Report", { // Renomeado para "Report"
  report_id: { // Renomeado para "report_id"
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
  denunciante_user_id: { // Renomeado para "denunciante_user_id"
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  reported_client_id: { // Renomeado para "reported_client_id"
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  reported_user_id: { // Renomeado para "reported_user_id"
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  tipo_denunciado: { // NOVO CAMPO: para armazenar 'user' ou 'client'
    type: DataTypes.ENUM("user", "client"),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pendente", "analisando", "resolvida", "rejeitada"),
    defaultValue: "pendente",
  },
  denunciante_nome: { // Renomeado para "denunciante_nome"
    type: DataTypes.STRING,
    allowNull: false,
  },
  denunciado_nome: { // Renomeado para "denunciado_nome"
    type: DataTypes.STRING,
    allowNull: false,
  },
  moderador: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'nenhum', // Adicionado valor padrão
  },
});

Report.belongsTo(client, { foreignKey: "reported_client_id", as: "reportedClient" }); // Atualizado foreignKey e alias
Report.belongsTo(User, { foreignKey: "reported_user_id", as: "reportedUser" }); // Atualizado foreignKey e alias
Report.belongsTo(User, { foreignKey: "denunciante_user_id", as: "denuncianteUser" }); // Atualizado foreignKey e alias

module.exports = Report;
