'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const hashedPassword = await bcrypt.hash('Admin123!', 10); // Hash de la contraseña
    return queryInterface.bulkInsert('usuarios', [{
      nombre: 'Admin 🚀',
      correo: 'admin@dominio.com',
      password: hashedPassword, // Contraseña hasheada
      rol_usuario: 'admin',
      estado: 'activo',
      created_at: new Date(),
      updated_at: new Date()
    }]);
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete('usuarios', { correo: 'admin@dominio.com' });
  }
};
