// backend/middlewares/admin.middleware.js
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET; // Usa variables de entorno en producción

const verificarAdmin = (req, res, next) => {
  try {
    // 1. Verificar si hay token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        mensaje: 'Token no proporcionado'
      });
    }

    // 2. Verificar y decodificar el token
    const decoded = jwt.verify(token, secret);

    // 3. Verificar si el usuario es administrador
    if (decoded.rol !== 'admin') {
      return res.status(403).json({
        success: false,
        mensaje: 'Acceso denegado: Se requieren privilegios de administrador'
      });
    }

    // 4. Adjuntar datos del usuario a la solicitud
    req.usuario = decoded;
    next();

  } catch (error) {
    console.error('Error en middleware de admin:', error);
    return res.status(401).json({
      success: false,
      mensaje: 'Token inválido o expirado'
    });
  }
};

module.exports = verificarAdmin;