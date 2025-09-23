const user = require('./user');
const style = require('./style');

user.belongsToMany(style, { through: 'UserStyles' });
style.belongsToMany(user, { through: 'UserStyles' });

