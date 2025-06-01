// Verificar si el usuario está logueado
const token = sessionStorage.getItem('token');
const rol = sessionStorage.getItem('rol');

if (!token || rol !== 'vendedor') {
  // Si no hay token, redirigir a login
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

const comentariosBtn = document.getElementById('comentariosBtn');
const comentariosModal = document.getElementById('comentariosModal');
const cerrarModal = document.getElementById('cerrarModal');

// Aquí puedes seguir escribiendo el JS de tu página de operador
console.log('Bienvenido Vendedor');
