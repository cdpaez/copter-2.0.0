// js/operador/filtroAvanzado.js
const FiltroAvanzadoModule = (function () {
    let todosLosProductos = [];
    let busquedaAvanzadaRealizada = false;

    async function init() {
        manejarDialogo();
        manejarEventosInputs();
        await cargarProductos();
        renderizarTabla(todosLosProductos);
        mostrarContadorTotal();
    }

    function manejarDialogo() {
        const floatingBtn = document.querySelector('.floating-btn');
        const dialog = document.getElementById('dialogoBusqueda');
        const closeBtn = document.getElementById('cerrarDialogo');

        if (floatingBtn && dialog && closeBtn) {
            floatingBtn.addEventListener('click', () => dialog.showModal());

            closeBtn.addEventListener('click', () => dialog.close());

            dialog.addEventListener('click', (e) => {
                const rect = dialog.getBoundingClientRect();
                if (
                    e.clientX < rect.left ||
                    e.clientX > rect.right ||
                    e.clientY < rect.top ||
                    e.clientY > rect.bottom
                ) {
                    dialog.close();
                }
            });
        }
    }

    function manejarEventosInputs() {
        document.querySelectorAll('.busqueda-avanzada input').forEach(input => {
            input.addEventListener('input', filtrarProductos);
        });

        const btnLimpiar = document.getElementById('limpiarBusqueda');
        if (btnLimpiar) {
            btnLimpiar.addEventListener('click', limpiarBusqueda);
        }
    }

    async function cargarProductos() {
        try {
            const res = await fetch('/equipos/obtener');
            if (!res.ok) throw new Error('Error al obtener productos');
            todosLosProductos = await res.json();
        } catch (error) {
            console.error('❌ Error al cargar productos:', error);
            const tabla = document.querySelector('#tablaProductos tbody');
            tabla.innerHTML = `<tr><td colspan="8">Error al cargar productos: ${error.message}</td></tr>`;
        }
    }

    function filtrarProductos() {
        const marca = getValueLower('filtroMarca');
        const modelo = getValueLower('filtroModelo');
        const procesador = getValueLower('filtroProcesador');
        const tamano = getValueLower('filtroTamano');
        const disco = getValueLower('filtroDisco');
        const ram = getValueLower('filtroRam');

        const resultados = todosLosProductos.filter(p =>
            (!marca || p.marca.toLowerCase().includes(marca)) &&
            (!modelo || p.modelo.toLowerCase().includes(modelo)) &&
            (!procesador || p.procesador.toLowerCase().includes(procesador)) &&
            (!tamano || p.tamano.toString().includes(tamano)) &&
            (!disco || p.disco.toLowerCase().includes(disco)) &&
            (!ram || p.memoria_ram.toLowerCase().includes(ram))
        );

        busquedaAvanzadaRealizada = true;

        mostrarContador(
            resultados.length,
            resultados.filter(p => p.stock === 'disponible').length,
            resultados.filter(p => p.stock === 'vendido').length
        );

        renderizarTabla(resultados);
    }

    function limpiarBusqueda() {
        if (!busquedaAvanzadaRealizada) return;

        document.querySelectorAll('.busqueda-avanzada input').forEach(input => input.value = '');

        renderizarTabla(todosLosProductos);
        mostrarContadorTotal();
        busquedaAvanzadaRealizada = false;
    }

    function renderizarTabla(productos) {
        const tabla = document.querySelector('#tablaProductos tbody');
        tabla.innerHTML = '';

        if (productos.length === 0) {
            tabla.innerHTML = '<tr><td colspan="8">No se encontraron productos</td></tr>';
            return;
        }

        productos.forEach(p => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${p.codigo_prd}</td>
                <td>${p.precio}</td>
                <td>${p.marca}</td>
                <td>${p.modelo}</td>
                <td>${p.procesador}</td>
                <td>${p.tamano}</td>
                <td>${p.disco}</td>
                <td>${p.memoria_ram}</td>
                <td>${p.stock}</td>
            `;
            tabla.appendChild(fila);
        });
    }

    function mostrarContador(total, disponibles, vendidos) {
        document.getElementById('contadorResultados').textContent = `${total} resultados encontrados`;
        document.getElementById('contadorDisponibles').textContent = `${disponibles} Disponibles`;
        document.getElementById('contadorVendidos').textContent = `${vendidos} Vendidos`;
    }

    function mostrarContadorTotal() {
        mostrarContador(
            todosLosProductos.length,
            contarPorStock('disponible'),
            contarPorStock('vendido')
        );
    }

    function contarPorStock(tipo) {
        return todosLosProductos.filter(p => p.stock === tipo).length;
    }

    function getValueLower(id) {
        const el = document.getElementById(id);
        return el ? el.value.trim().toLowerCase() : '';
    }

    // 🚪 API pública
    return {
        init
    };
})();

// 🧨 Lanzar módulo
document.addEventListener('DOMContentLoaded', () => {
    FiltroAvanzadoModule.init();
});
