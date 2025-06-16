const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Guarda archivos temporales
// require('../controllers/dashboard/equipo.controller')
const { 
  obtenerEquipos, 
  eliminarEquipos, 
  obtenerEquiposPorId, 
  anadirEquipos, 
  actualizarEquipos, 
  importarEquipos 
} = require('../controllers/dashboard/equipo.controller')

router.post('/crear', anadirEquipos);
router.get('/obtener', obtenerEquipos);
router.get('/obtener/:id', obtenerEquiposPorId);
router.delete('/eliminar/:id', eliminarEquipos);
router.put('/actualizar/:id', actualizarEquipos);

// importar productos desde un archivo xls/csv
router.post('/importar', upload.single('archivo'), importarEquipos);

// require('../controllers/vendedor/equipo.controller')
const { buscarEquipos } = require('../controllers/vendedor/equipo.controller');
router.get('/buscar', buscarEquipos);

module.exports = router;