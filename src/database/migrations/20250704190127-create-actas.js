'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('actas', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      cliente_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'clientes', key: 'id' },
        onDelete: 'CASCADE'
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id' },
        onDelete: 'CASCADE'
      },
      equipo_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'equipos', key: 'id' },
        onDelete: 'CASCADE'
      },
      vendedor_nombre: {
        type: DataTypes.STRING,
        allowNull: false
      },
      observaciones: DataTypes.TEXT,
      forma_pago: DataTypes.STRING,
      precio: DataTypes.DECIMAL(10, 2),
      fecha_registro: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      // otros campos específicos de actas aquí...
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('actas');
  }
};
