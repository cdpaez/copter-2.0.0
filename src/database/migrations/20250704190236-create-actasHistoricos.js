'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('actas_historicos', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      cliente_nombre: {
        type: Sequelize.STRING
      },
      cliente_cedula: {
        type: Sequelize.STRING
      },
      cliente_telefono: {
        type: Sequelize.STRING
      },
      cliente_direccion: {
        type: Sequelize.STRING
      },
      equipo_codigo_prd: {
        type: Sequelize.STRING,
        allowNull: false
      },
      equipo_marca: {
        type: Sequelize.STRING
      },
      equipo_modelo: {
        type: Sequelize.STRING
      },
      equipo_numero_serie: {
        type: Sequelize.STRING
      },
      equipo_procesador: {
        type: Sequelize.STRING
      },
      equipo_tamano: {
        type: Sequelize.STRING
      },
      equipo_disco: {
        type: Sequelize.STRING
      },
      equipo_memoria_ram: {
        type: Sequelize.STRING
      },
      equipo_tipo: {
        type: Sequelize.STRING
      },
      equipo_estado: {
        type: Sequelize.STRING
      },
      equipo_extras: {
        type: Sequelize.TEXT
      },
      inspeccion_hw: {
        type: Sequelize.JSON
      },
      inspeccion_sw: {
        type: Sequelize.JSON
      },
      adicionales: {
        type: Sequelize.JSON
      },
      observaciones: {
        type: Sequelize.TEXT
      },
      forma_pago: {
        type: Sequelize.STRING
      },
      precio: {
        type: Sequelize.DECIMAL(10, 2)
      },
      vendedor_nombre: {
        type: Sequelize.STRING
      },
      fecha_registro: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
      // updatedAt no se usa según el modelo
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('actas_historicos');
  }
};
