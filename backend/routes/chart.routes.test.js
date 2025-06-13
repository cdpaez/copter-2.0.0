const express = require('express');
const router = express.Router();
const chartController = require('../controllers/dashboard/chart.controller.test');

router.get('/ventas-mensuales', chartController.ventasPorMes);

module.exports = router;
