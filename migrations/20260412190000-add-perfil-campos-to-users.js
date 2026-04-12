'use strict';

/** Campos extras de perfil (mobile / edição). */
module.exports = {
  async up(queryInterface) {
    const { sequelize } = queryInterface;
    await sequelize.query(`
      ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "data_nascimento" DATE;
    `);
    await sequelize.query(`
      ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "genero" VARCHAR(40);
    `);
    await sequelize.query(`
      ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "cidade" VARCHAR(120);
    `);
    await sequelize.query(`
      ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "uf" VARCHAR(2);
    `);
    await sequelize.query(`
      ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "estilo_favorito" VARCHAR(80);
    `);
  },

  async down(queryInterface) {
    const { sequelize } = queryInterface;
    await sequelize.query(`ALTER TABLE "Users" DROP COLUMN IF EXISTS "estilo_favorito";`);
    await sequelize.query(`ALTER TABLE "Users" DROP COLUMN IF EXISTS "uf";`);
    await sequelize.query(`ALTER TABLE "Users" DROP COLUMN IF EXISTS "cidade";`);
    await sequelize.query(`ALTER TABLE "Users" DROP COLUMN IF EXISTS "genero";`);
    await sequelize.query(`ALTER TABLE "Users" DROP COLUMN IF EXISTS "data_nascimento";`);
  },
};
