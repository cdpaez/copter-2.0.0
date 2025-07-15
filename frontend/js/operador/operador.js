// js/operador/interfaceVendedor.js
const InterfaceVendedorModule = (function () {
    function init() {
        manejarMenuHamburguesa();
        verificarSesion();
        manejarBotonCerrarSesion();
        manejarModalComentarios();
    }

    function manejarMenuHamburguesa() {
        const hamburgerBtn = document.querySelector('.hamburger-btn');
        const panelLateral = document.querySelector('.panel-lateral');
        const navButtons = document.querySelectorAll('.pestanas button');

        if (!hamburgerBtn || !panelLateral) return;

        hamburgerBtn.addEventListener('click', function () {
            this.classList.toggle('active');
            panelLateral.classList.toggle('active');
            document.body.style.overflow = panelLateral.classList.contains('active') ? 'hidden' : '';
        });

        navButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    hamburgerBtn.classList.remove('active');
                    panelLateral.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });

        document.addEventListener('click', function (e) {
            if (
                window.innerWidth <= 768 &&
                panelLateral.classList.contains('active') &&
                !e.target.closest('.panel-lateral') &&
                !e.target.closest('.hamburger-btn')
            ) {
                hamburgerBtn.classList.remove('active');
                panelLateral.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    function verificarSesion() {
        const token = sessionStorage.getItem('token');
        const rol = sessionStorage.getItem('rol');

        if (!token || rol !== 'vendedor') {
            window.location.href = '../../index.html';
        }
    }

    function manejarBotonCerrarSesion() {
        window.cerrarSesion = function () {
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
                    Swal.fire({
                        title: '¡Hasta pronto!',
                        text: 'Tu sesión ha sido cerrada correctamente.',
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false,
                        timerProgressBar: true,
                        didClose: () => {
                            sessionStorage.clear();
                            history.replaceState(null, '', 'index.html');
                            window.location.href = '../../index.html';
                        }
                    });
                }
            });
        };
    }

    function manejarModalComentarios() {
        const comentariosBtn = document.getElementById('comentariosBtn');
        const comentariosModal = document.getElementById('comentariosModal');
        const cerrarModal = document.getElementById('cerrarModal');

        if (!comentariosBtn || !comentariosModal || !cerrarModal) return;

        comentariosBtn.addEventListener('click', () => {
            comentariosModal.showModal();
        });

        cerrarModal.addEventListener('click', () => {
            comentariosModal.close();
        });
    }

    return {
        init
    };
})();

// 🚀 Arrancar
document.addEventListener('DOMContentLoaded', () => {
    InterfaceVendedorModule.init();
});
