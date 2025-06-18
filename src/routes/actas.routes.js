const express = require('express');
const router = express.Router();
const { crearActaCompleta } = require('../controllers/vendedor/actas.controller');
const { obtenerActaPorId, obtenerActasResumen } = require('../controllers/dashboard/actas.controller');
const { getPDFActaPorId } = require('../controllers/vendedor/actas.controller');

// Ruta para registrar una acta completa con cliente, equipo, inspecciones, adicionales y acta
router.post('/', crearActaCompleta);
router.get('/:id/pdf', getPDFActaPorId);

// ruta para visualizar las actas registradas en el dashboard
router.get('/resumen', obtenerActasResumen);
router.get('/:id', obtenerActaPorId);

module.exports = router;
