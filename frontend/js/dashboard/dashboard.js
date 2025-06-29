// frontend/public/js/dashboard/dashboard.js
const hamburgerBtn = document.querySelector('.hamburger-btn');
const panelLateral = document.querySelector('.panel-lateral');

// Alternar menú
hamburgerBtn.addEventListener('click', function () {
  this.classList.toggle('active');
  panelLateral.classList.toggle('active');

  // Opcional: deshabilitar scroll cuando el menú está abierto
  document.body.style.overflow = panelLateral.classList.contains('active') ? 'hidden' : '';
});

// Cerrar menú al hacer clic en un enlace (opcional)
const navButtons = document.querySelectorAll('.pestanas button');
navButtons.forEach(button => {
  button.addEventListener('click', function () {
    if (window.innerWidth <= 768) {
      hamburgerBtn.classList.remove('active');
      panelLateral.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
});

// Cerrar menú al hacer clic fuera (opcional)
document.addEventListener('click', function (e) {
  if (window.innerWidth <= 768 &&
    panelLateral.classList.contains('active') &&
    !e.target.closest('.panel-lateral') &&
    !e.target.closest('.hamburger-btn')) {
    hamburgerBtn.classList.remove('active');
    panelLateral.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// Verificar si el usuario está logueado
const token = sessionStorage.getItem('token');
const rol = sessionStorage.getItem('rol');

if (!token || rol !== 'admin') {
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