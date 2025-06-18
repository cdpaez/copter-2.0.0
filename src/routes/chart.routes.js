const express = require('express');
const router = express.Router();
const {
  obtenerActasPorUsuarioConFechas,
  obtenerEquiposEntregadosPorMes,obtenerTotalGeneradoPorMes
} = require('../controllers/dashboard/chart.controller');

// Rutas estadísticas
router.get('/actas-por-usuario', obtenerActasPorUsuarioConFechas);
router.get('/equipos-mas-vendidos', obtenerEquiposEntregadosPorMes);
router.get('/total-por-usuario', obtenerTotalGeneradoPorMes);

module.exports = router;
