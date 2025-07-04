'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('inspeccion_hardware', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      acta_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'actas', // asegúrate que esta tabla existe y tiene id
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      teclado_estado: {
        type: Sequelize.BOOLEAN
      },
      teclado_observacion: {
        type: Sequelize.STRING
      },
      mouse_estado: {
        type: Sequelize.BOOLEAN
      },
      mouse_observacion: {
        type: Sequelize.STRING
      },
      camara_estado: {
        type: Sequelize.BOOLEAN
      },
      camara_observacion: {
        type: Sequelize.STRING
      },
      pantalla_estado: {
        type: Sequelize.BOOLEAN
      },
      pantalla_observacion: {
        type: Sequelize.STRING
      },
      parlantes_estado: {
        type: Sequelize.BOOLEAN
      },
      parlantes_observacion: {
        type: Sequelize.STRING
      },
      bateria_estado: {
        type: Sequelize.BOOLEAN
      },
      bateria_observacion: {
        type: Sequelize.STRING
      },
      carcasa_estado: {
        type: Sequelize.BOOLEAN
      },
      carcasa_observacion: {
        type: Sequelize.STRING
      },
      cargador_estado: {
        type: Sequelize.BOOLEAN
      },
      cargador_observacion: {
        type: Sequelize.STRING
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('inspeccion_hardware');
  }
};
