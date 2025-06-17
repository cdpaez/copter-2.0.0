'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Configuración del usuario admin
    const adminUser = {
      nombre: 'Administrador',
      correo: 'admin@example.com',
      password: await bcrypt.hash('admin1234', 10), // Hash de la contraseña
      rol_usuario: 'admin',
      estado: 'activo',
    };

    // Insertar el usuario admin en la tabla 'usuarios'
    await queryInterface.bulkInsert('usuarios', [adminUser], {});
  },

  async down(queryInterface, Sequelize) {
    // Eliminar el usuario admin por su correo
    await queryInterface.bulkDelete('usuarios', {
      correo: 'admin@example.com'
    }, {});
  }
};