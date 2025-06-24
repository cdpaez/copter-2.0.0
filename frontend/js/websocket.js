const token = sessionStorage.getItem('token'); // o localStorage

if (token) {
    // Detecta si estás en local o producción y usa la URL correcta
    const wsBaseURL = window.location.hostname === 'localhost'
        ? 'ws://localhost:3000'
        : 'wss://copter-2-0-0.onrender.com';

    const socket = new WebSocket(`${wsBaseURL}/ws?token=${token}`);

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

            localStorage.removeItem('token');
            sessionStorage.clear();

            window.location.href = '/index.html';
        }
    };

    socket.onerror = (err) => {
        console.error('⚠️ WebSocket error:', err);
    };
}
