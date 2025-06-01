const express = require('express');
const cors = require('cors');
const app = express();
const sequelize = require('./config/database'); // Tu conexión Sequelize
const PORT = process.env.PORT;
const path = require('path');


// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());



// Servir archivos estáticos desde /frontend
app.use(express.static(path.join(__dirname, '../')))
app.use(express.static(path.join(__dirname, '../frontend')));
// Rutas de ejemplo (puedes ir agregando más)
app.get('/factura', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'factura.html'));
});

// Levantar el servidor después de conectar a la DB
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos exitosa');

    await sequelize.sync(); // crea tablas si no existen
    console.log('📦 Tablas sincronizadas');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error);
  }
})();

// -------------------- Rutas API --------------------
app.use('/login', require('./routes/login.routes'));
app.use('/actas', require('./routes/actas.routes'));
app.use('/equipos', require('./routes/equipos.routes'))
app.use('/usuarios', require('./routes/usuario.routes'))
// falta implementar las estadisticas del operador
// const chartRoutes = require('./routes/chart.routes')
// app.use('/chart',chartRoutes)
