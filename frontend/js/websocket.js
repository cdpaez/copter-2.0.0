// Asegúrate de tener el token válido antes de conectar
const token = sessionStorage.getItem('token'); // o como manejes tu auth

if (token) {
    const socket = new WebSocket(`ws://localhost:3000/ws?token=${token}`);

    socket.onopen = () => {
        console.log('🟢 WebSocket conectado');
    };

    socket.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            if (data.type === 'connection_established') {
                console.log('✅ Conexión WebSocket establecida');
            }
            // Aquí podrías manejar otros tipos de mensajes si luego lo necesitas
        } catch (err) {
            console.error('Error al parsear mensaje WebSocket:', err);
        }
    };

    socket.onclose = (event) => {
        console.warn('🔴 WebSocket cerrado:', event.code, event.reason);

        if (event.code === 4003) {
            alert('Has sido desconectado porque tu cuenta fue desactivada.');

            // Limpia la sesión (adaptar según cómo guardes tokens)
            localStorage.removeItem('token');
            sessionStorage.clear(); // si usas sessionStorage también

            // Redirige al login (ajusta ruta si usas React Router)
            window.location.href = '/index.html';
        }
    };

    socket.onerror = (err) => {
        console.error('⚠️ WebSocket error:', err);
    };
}