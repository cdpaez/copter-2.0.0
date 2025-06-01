const express = require('express');
const router = express.Router();
const { crearCliente, buscarCliente } = require('../controllers/vendedor/cliente.controller');

// POST /clientes
router.post('/', crearCliente);

// GET /clientes
router.get('/buscar', buscarCliente);

module.exports = router;
