const sequelize = require('../db/database.js');

async function checkDBConnection() {
  console.log(sequelize);
  try {
    await sequelize.authenticate();
    return true;
  } catch (err) {
    return false;
  }
}

module.exports = { checkDBConnection };
