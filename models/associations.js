const Client = require('./Client');
const Session = require('./Session');
const User = require('./user');

// Definir relacionamentos
Client.belongsTo(User, { foreignKey: 'user_id' });
Client.hasMany(Session, { foreignKey: 'cliente_id', as: 'sessoes' });

Session.belongsTo(Client, { foreignKey: 'cliente_id', as: 'cliente' });
Session.belongsTo(User, { foreignKey: 'usuario_id' });

module.exports = {
  Client,
  Session,
  User
};
