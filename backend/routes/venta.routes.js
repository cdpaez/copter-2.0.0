const express = require('express');
const router = express.Router();
const { obtenerVentas } = require('../controllers/dashboard/venta.controller');
const { crearVentas } = require('../controllers/vendedor/venta.controller');
// informacion que va hacia el dashboard
router.get('/obtener', obtenerVentas);

// POST /ventas
router.post('/', crearVentas);

module.exports = router;
