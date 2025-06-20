'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Configuración del usuario admin
    const hashedPassword1 = await bcrypt.hash('123', 10);
    const hashedPassword2 = await bcrypt.hash('123', 10);

    const adminUser1 = {
      nombre: 'Jose Abarca',
      correo: 'Jose@example.com',
      password: hashedPassword1, // Hash de la contraseña
      rol_usuario: 'admin',
      estado: 'activo',
    };
    const adminUser2 = {
      nombre: 'Andres Moscoso',
      correo: 'Andres@example.com',
      password: hashedPassword2, // Hash de la contraseña
      rol_usuario: 'admin',
      estado: 'activo',
    };

    // Insertar el usuario admin en la tabla 'usuarios'
    await queryInterface.bulkInsert('usuarios', [adminUser1, adminUser2], {});
  },

  async down(queryInterface, Sequelize) {
    // Eliminar el usuario admin por su correo
    await queryInterface.bulkDelete('usuarios', {
      correo: ['Jose@example.com', 'Andres@example.com']
    }, {});
  }
};