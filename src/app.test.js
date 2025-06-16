// app.js (versión segura y funcional)
const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { expressCspHeader } = require('express-csp-header');

const app = express();

// 1️⃣ Seguridad básica
app.use(helmet({ contentSecurityPolicy: false })); // Desactiva CSP de helmet para usar expressCspHeader
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 2️⃣ CSP personalizada (Content Security Policy)
app.use(expressCspHeader({
  directives: {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'"],
    'script-src-elem': ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
    'style-src': ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com"],
    'style-src-elem': ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com"],
    'font-src': ["'self'", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net"],
    'img-src': ["'self'", "data:", "https://cdn.jsdelivr.net"]
  }
}));

// 3️⃣ CORS con whitelist
const whitelist = ['http://localhost:3000', 'https://tudominio.com'];
app.use(cors({
  origin: (origin, callback) => {
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Bloqueado por CORS'));
    }
  },
  credentials: true
}));

// 4️⃣ Rate Limiting (para proteger rutas API)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // Límite por IP
});
app.use('/api/', limiter);

// 5️⃣ Archivos estáticos
app.use(express.static(path.join(__dirname, '../frontend'), {
  dotfiles: 'ignore',
  index: false
}));

// 6️⃣ Rutas API
app.use('/api/login', require('./routes/login.routes'));
app.use('/api/actas', require('./routes/actas.routes'));
// ... otras rutas API si las tienes (equipos, usuarios, etc.)

// 7️⃣ Ruta principal (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

module.exports = app;
