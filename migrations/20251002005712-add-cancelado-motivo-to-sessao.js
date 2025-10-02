'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Sessaos', 'cancelado', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });

    await queryInterface.addColumn('Sessaos', 'motivo', {
      type: Sequelize.STRING,
      validate: {
        len: [0, 255]
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Sessaos', 'motivo');
    await queryInterface.removeColumn('Sessaos', 'cancelado');
  }
};
