'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Verifica si ya existen los usuarios por su correo
    const [existingUsers] = await queryInterface.sequelize.query(`
      SELECT correo FROM usuarios 
      WHERE correo IN ('Jose@example.com', 'Andres@example.com');
    `);

    const existingEmails = existingUsers.map(user => user.correo);

    const usersToInsert = [];

    if (!existingEmails.includes('Jose@example.com')) {
      const hashedPassword1 = await bcrypt.hash('123', 10);
      usersToInsert.push({
        nombre: 'Jose Abarca',
        correo: 'Jose@example.com',
        password: hashedPassword1,
        rol_usuario: 'admin',
        estado: 'activo',
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    if (!existingEmails.includes('Andres@example.com')) {
      const hashedPassword2 = await bcrypt.hash('123', 10);
      usersToInsert.push({
        nombre: 'Andres Moscoso',
        correo: 'Andres@example.com',
        password: hashedPassword2,
        rol_usuario: 'admin',
        estado: 'activo',
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    if (usersToInsert.length > 0) {
      await queryInterface.bulkInsert('usuarios', usersToInsert, {});
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('usuarios', {
      correo: ['Jose@example.com', 'Andres@example.com']
    }, {});
  }
};
