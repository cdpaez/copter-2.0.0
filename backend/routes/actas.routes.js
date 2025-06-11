const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const { crearActaCompleta } = require('../controllers/vendedor/actas.controller');
const { obtenerActaPorId, obtenerActasResumen } = require('../controllers/dashboard/actas.controller');

// Ruta para registrar una acta completa con cliente, equipo, inspecciones, adicionales y acta
router.post('/', crearActaCompleta);

// ruta para visualizar las actas registradas en el dashboard
router.get('/resumen', obtenerActasResumen);
router.get('/:id', obtenerActaPorId);

// Ruta para descargar un PDF de acta directamente
router.get('/descargar/:archivo', (req, res) => {
  const nombreArchivo = req.params.archivo;
  const rutaAbsoluta = path.join(__dirname, '..', '..', 'uploads', 'actas', nombreArchivo);

  // Verificamos que el archivo exista
  if (!fs.existsSync(rutaAbsoluta)) {
    return res.status(404).send('Archivo no encontrado');
  }

  res.download(rutaAbsoluta, nombreArchivo, (err) => {
    if (err) {
      console.error('❌ Error al forzar descarga:', err);
      res.status(500).send('Error al descargar el archivo');
    }
  });
});
module.exports = router;
