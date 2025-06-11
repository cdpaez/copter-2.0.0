// server.js
const app = require('./app');
const sequelize = require('./config/database');
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos exitosa');

    await sequelize.sync({alter:true});
    console.log('📦 Tablas sincronizadas');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error);
  }
})();
