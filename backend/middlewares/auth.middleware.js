// middleware/auth.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
  if (!token) return res.status(401).json({ mensaje: 'Token no proporcionado' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ mensaje: 'Token inválido' });
    req.user = decoded; // Guarda datos del token en la request
    next();
  });
};

module.exports = { verifyToken };
