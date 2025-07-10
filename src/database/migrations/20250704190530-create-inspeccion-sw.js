'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('inspeccion_software', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      acta_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'actas', // tabla padre
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      sistema_operativo: {
        type: Sequelize.BOOLEAN
      },
      antivirus: {
        type: Sequelize.BOOLEAN
      },
      office: {
        type: Sequelize.BOOLEAN
      },
      navegadores: {
        type: Sequelize.BOOLEAN
      },
      compresores: {
        type: Sequelize.BOOLEAN
      },
      acceso_remoto: {
        type: Sequelize.BOOLEAN
      },
      nota: {
        type: Sequelize.STRING
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('inspeccion_software');
  }
};
