'use strict';

/**
 * Colunas podem já existir no Postgres (schema criado antes do Sequelize marcar a migration).
 * Usa IF NOT EXISTS para a fila de migrations seguir até as próximas (ex.: perfil no Users).
 */
module.exports = {
  async up(queryInterface) {
    const { sequelize } = queryInterface;
    await sequelize.query(`
      ALTER TABLE "Sessaos" ADD COLUMN IF NOT EXISTS "cancelado" BOOLEAN DEFAULT false;
    `);
    await sequelize.query(`
      ALTER TABLE "Sessaos" ADD COLUMN IF NOT EXISTS "motivo" VARCHAR(255);
    `);
  },

  async down(queryInterface) {
    const { sequelize } = queryInterface;
    await sequelize.query(`
      ALTER TABLE "Sessaos" DROP COLUMN IF EXISTS "motivo";
    `);
    await sequelize.query(`
      ALTER TABLE "Sessaos" DROP COLUMN IF EXISTS "cancelado";
    `);
  },
};
