const express = require('express');
const router = express.Router();
const actasController = require('../controllers/vendedor/actas.controller');
const { obtenerActaPorId, obtenerActasResumen} = require('../controllers/dashboard/actas.controller');

// Ruta para registrar una acta completa con cliente, equipo, inspecciones, adicionales y acta
router.post('/', actasController.crearActaCompleta);
router.get('/resumen', obtenerActasResumen);
router.get('/:id', obtenerActaPorId);
module.exports = router;
