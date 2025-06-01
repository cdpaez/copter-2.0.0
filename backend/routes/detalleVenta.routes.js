const express = require('express');
const router = express.Router();
const { crearDetalleVenta, obtenerDetallesPorVenta } = require('../controllers/vendedor/detalleVenta.controller');

router.post('/', crearDetalleVenta);
router.get('/:ventaId', obtenerDetallesPorVenta);

module.exports = router;
