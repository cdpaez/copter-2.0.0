const WebSocket = require('ws');
const jwt = require('jsonwebtoken'); // Asumiendo que usas JWT

// Mapa para almacenar conexiones: { userId: Set<WebSocket> }
const activeConnections = new Map();

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server, path: '/ws' });

  wss.on('connection', (ws, req) => {
    // 1. Extraer token de la URL (ej: /ws?token=xxx)
    const token = new URL(req.url, `ws://${req.headers.host}`).searchParams.get('token');

    try {
      // 2. Verificar token y extraer userId
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      // 3. Almacenar conexión
      if (!activeConnections.has(userId)) {
        activeConnections.set(userId, new Set());
      }
      activeConnections.get(userId).add(ws);

      // 4. Limpiar al cerrar conexión
      ws.on('close', () => {
        activeConnections.get(userId)?.delete(ws);
        if (activeConnections.get(userId)?.size === 0) {
          activeConnections.delete(userId);
        }
      });

      // 5. Opcional: Confirmar conexión exitosa
      ws.send(JSON.stringify({ type: 'connection_established' }));

    } catch (error) {
      console.error('Conexión WS no autorizada:', error);
      ws.close(4001, 'Autenticación fallida'); // Código 4001 = Unauthorized
    }
  });
}

function forceDisconnect(userId) {
  if (activeConnections.has(userId)) {
    activeConnections.get(userId).forEach(ws => {
      ws.close(4003, 'Usuario desactivado'); // Código 4003 = Forced disconnect
    });
    activeConnections.delete(userId);
  }
}

module.exports = { setupWebSocket, forceDisconnect };