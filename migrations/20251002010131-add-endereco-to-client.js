
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Clients', 'endereco', {
      type: Sequelize.STRING,
      validate: {
        len: [0, 255]
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Clients', 'endereco');
  }
};

