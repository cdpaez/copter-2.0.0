require('dotenv').config();
const app = require('./app');
const { sequelizeInstance } = require('./config/database.test');
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    // 1. Autenticar conexión a la base de datos
    await sequelizeInstance.authenticate();
    console.log('✅ Conexión a la base de datos exitosa');

    // 2. Verificar si necesitas ejecutar migraciones pendientes
    if (process.env.RUN_MIGRATIONS === 'true') {
      const { execSync } = require('child_process');
      console.log('🔁 Ejecutando migraciones...');
      execSync('npx sequelize-cli db:migrate', { stdio: 'inherit' });
    }

    // 3. Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📝 Modo migraciones: ${process.env.RUN_MIGRATIONS || 'false'}`);
    });

  } catch (error) {
    console.error('❌ Error de inicialización:', error);
    process.exit(1); // Termina el proceso con código de error
  }
})();