// backend/routes/login.routes.js
const express = require('express');
const router = express.Router();
const { login } = require('../controllers/login.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.post('/', login);

module.exports = router;
