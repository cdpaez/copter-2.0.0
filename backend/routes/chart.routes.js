const express = require('express');
const router = express.Router();
const {
  obtenerVentasPorUsuario,
  obtenerProductosMasVendidos,
  obtenerTotalPorUsuario
} = require('../controllers/dashboard/chart.controller');

// Rutas estadísticas
router.get('/ventas-por-usuario', obtenerVentasPorUsuario);
router.get('/productos-mas-vendidos', obtenerProductosMasVendidos);
router.get('/total-por-usuario', obtenerTotalPorUsuario);

module.exports = router;
