const token = sessionStorage.getItem('token'); // o localStorage

if (token) {
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

            if (data.type === 'forced_logout') {
                console.warn('⛔ Usuario deshabilitado (mensaje explícito)');

                // Guardamos el motivo para mostrar en el login
                sessionStorage.setItem('logout_reason', 'disabled');

                // Limpiamos la sesión
                sessionStorage.removeItem('token');
                sessionStorage.clear();

                // Redireccionamos al login
                window.location.href = '/index.html';

                // Cerramos el socket manualmente
                socket.close();
            }

        } catch (err) {
            console.error('Error al parsear mensaje WebSocket:', err);
        }
    };

    socket.onclose = (event) => {
        console.warn('🔴 WebSocket cerrado:', event.code, event.reason);

        // En caso de que sí funcione el código de cierre
        if (event.code === 4003) {
            sessionStorage.setItem('logout_reason', 'disabled');
            sessionStorage.removeItem('token');
            sessionStorage.clear();
            // Esperar unos milisegundos antes de redirigir
            setTimeout(() => {
                window.location.href = '/index.html';
            }, 100); // 100ms es suficiente
        }
    };

    socket.onerror = (err) => {
        console.error('⚠️ WebSocket error:', err);
    };
}
