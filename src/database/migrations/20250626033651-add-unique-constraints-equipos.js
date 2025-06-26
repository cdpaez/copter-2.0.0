'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('equipos', {
      fields: ['codigo_prd'],
      type: 'unique',
      name: 'unique_codigo_prd'
    });

    await queryInterface.addConstraint('equipos', {
      fields: ['numero_serie'],
      type: 'unique',
      name: 'unique_numero_serie'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('equipos', 'unique_codigo_prd');
    await queryInterface.removeConstraint('equipos', 'unique_numero_serie');
  }
};
