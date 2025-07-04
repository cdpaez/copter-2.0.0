'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('adicionales', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      acta_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'actas',  // Asegúrate que la tabla 'actas' exista y tenga id
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      mouse_estado: {
        type: Sequelize.BOOLEAN
      },
      mouse_observacion: {
        type: Sequelize.STRING
      },
      mochila_estado: {
        type: Sequelize.BOOLEAN
      },
      mochila_observacion: {
        type: Sequelize.STRING
      },
      estuche_estado: {
        type: Sequelize.BOOLEAN
      },
      estuche_observacion: {
        type: Sequelize.STRING
      },
      software1_estado: {
        type: Sequelize.BOOLEAN
      },
      software1_observacion: {
        type: Sequelize.STRING
      },
      software2_estado: {
        type: Sequelize.BOOLEAN
      },
      software2_observacion: {
        type: Sequelize.STRING
      },
      software3_estado: {
        type: Sequelize.BOOLEAN
      },
      software3_observacion: {
        type: Sequelize.STRING
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('adicionales');
  }
};
