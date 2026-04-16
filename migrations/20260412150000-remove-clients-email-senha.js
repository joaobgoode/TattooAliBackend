'use strict';

/** Login do cliente fica no Supabase/Users; a tabela Clients não armazena email nem senha. */
module.exports = {
  async up(queryInterface) {
    const { sequelize } = queryInterface;
    await sequelize.query(`ALTER TABLE "Clients" DROP COLUMN IF EXISTS "email";`);
    await sequelize.query(`ALTER TABLE "Clients" DROP COLUMN IF EXISTS "senha";`);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('Clients', 'email', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    });
    await queryInterface.addColumn('Clients', 'senha', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
