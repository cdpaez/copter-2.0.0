// frontend/public/js/dashboard/dashboard.js

// Verificar si el usuario está logueado
const token = sessionStorage.getItem('token');
const rol = sessionStorage.getItem('rol');

if (!token || rol !=='admin') {
  window.location.href = '../../index.html';
}
function cerrarSesion() {
  Swal.fire({
    title: '¿Cerrar sesión?',
    text: 'Se cerrará tu sesión actual y volverás al inicio.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e74c3c',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, cerrar sesión',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      // Mostrar mensaje de despedida antes de redirigir
      Swal.fire({
        title: '¡Hasta pronto!',
        text: 'Tu sesión ha sido cerrada correctamente.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true,
        didClose: () => {
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('rol');
          sessionStorage.removeItem('usuarioId');
          history.replaceState(null, '', 'index.html');
          window.location.href = '../../index.html';
        }
      });
    }
  });
}

// Aquí puedes seguir escribiendo el JS de tu dashboard
console.log('Bienvenido al Dashboard');
