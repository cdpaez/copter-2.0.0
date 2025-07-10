'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('equipos', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      codigo_prd: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      marca: Sequelize.STRING,
      modelo: Sequelize.STRING,
      numero_serie: {
        type: Sequelize.STRING,
        unique: true
      },
      procesador: Sequelize.STRING,
      tamano: Sequelize.STRING,
      disco: Sequelize.STRING,
      memoria_ram: Sequelize.STRING,
      tipo_equipo: Sequelize.STRING,
      estado: Sequelize.STRING,
      extras: Sequelize.STRING,
      stock: {
        type: Sequelize.ENUM('vendido', 'disponible'),
        allowNull: false,
        defaultValue: 'disponible'
      },
      precio: Sequelize.DOUBLE,
      fecha: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('equipos');
  }
};
