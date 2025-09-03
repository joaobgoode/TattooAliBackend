require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
});


async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Conectado com sucesso!");
  } catch (err) {
    console.error("Erro ao conectar:", err);
  }
}

testConnection();

module.exports = sequelize;
