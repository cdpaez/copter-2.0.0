const dotenv = require('dotenv');
dotenv.config()
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET; // debe estar en .env

const verificarToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) return res.status(401).json({ error: 'Token requerido' });

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

module.exports = verificarToken;
