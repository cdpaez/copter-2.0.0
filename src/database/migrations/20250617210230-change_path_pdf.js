'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Eliminar la columna "path_pdf" de la tabla "acta"
    await queryInterface.removeColumn('actas', 'path_pdf');
  },

  async down(queryInterface, Sequelize) {
    // Volver a agregar la columna "path_pdf" si se revierte la migración
    await queryInterface.addColumn('actas', 'path_pdf', {
      type: Sequelize.STRING, // Usa STRING si antes era una ruta de archivo
      allowNull: true,        // Asume que puede ser null; ajústalo si era not null
    });
  }
};
