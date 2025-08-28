const app = require('./app.js');
const sequelize = require('./db/database.js');

sequelize.sync().then(() => {
  console.log('Banco sincronizado!');
  app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
  });
}).catch((err) => {
  console.error('Erro ao sincronizar o banco:', err);
});
