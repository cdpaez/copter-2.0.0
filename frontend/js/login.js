document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");

  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault(); // Evitar el comportamiento por defecto del formulario

    // Recoger los valores de los campos de correo y contraseña
    const correo = document.getElementById("correo").value;
    const password = document.getElementById("password").value;

    // Crear el objeto de datos a enviar al backend
    const loginData = { correo, password };

    try {
      // Hacer la petición POST al backend
      const res = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      // Convertir la respuesta a JSON
      const data = await res.json();

      // Comprobar si la respuesta es exitosa
      if (res.ok) {
        // Guardar el token en sessionStorage
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('rol', data.rol);
        sessionStorage.setItem('usuarioId', data.id);
        // Redirigir según el rol
        window.location.href = data.redirect;
      } else {
        // Mostrar el mensaje de error
        mostrarError(data.mensaje);
      }
    } catch (error) {
      console.error("Error al hacer la petición:", error);
      alert("Hubo un problema al hacer la petición. Intenta de nuevo.");
    }
  });
  // mensaje de desconexion
  const reason = sessionStorage.getItem('logout_reason');

  if (reason === 'disabled') {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
      errorDiv.textContent = '⚠️ cuenta desactivada.';
      errorDiv.classList.add('mostrar'); // 👈 Aquí se activa la animación

      const form = document.querySelector('.login-form');
      if (form) {
        form.addEventListener('input', () => {
          errorDiv.classList.remove('mostrar');
          errorDiv.textContent = '';
        }, { once: true });
      }
    }

    sessionStorage.removeItem('logout_reason');
  }
  function mostrarError(mensaje) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = mensaje;
    errorDiv.classList.add('mostrar');

    setTimeout(() => {
      errorDiv.classList.remove('mostrar');
    }, 3000); // 3 segundos visible
  }

});