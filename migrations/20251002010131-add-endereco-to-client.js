'use strict';

module.exports = {
  async up(queryInterface) {
    const { sequelize } = queryInterface;
    await sequelize.query(`
      ALTER TABLE "Clients" ADD COLUMN IF NOT EXISTS "endereco" VARCHAR(255);
    `);
  },

  async down(queryInterface) {
    const { sequelize } = queryInterface;
    await sequelize.query(`
      ALTER TABLE "Clients" DROP COLUMN IF EXISTS "endereco";
    `);
  },
};
