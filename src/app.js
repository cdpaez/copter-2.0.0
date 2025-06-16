// app.js
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Archivos estáticos
app.use(express.static(path.join(__dirname, '../')))
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas básicas
app.get('/factura', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'factura.html'));
});

// Rutas API
app.use('/login', require('./routes/login.routes'));
app.use('/actas', require('./routes/actas.routes'));
app.use('/equipos', require('./routes/equipos.routes'));
app.use('/usuarios', require('./routes/usuario.routes'));
app.use('/chart', require('./routes/chart.routes.test'))

// Exportar solo la app
module.exports = app;
