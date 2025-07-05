document.addEventListener('DOMContentLoaded', function () {
    const floatingBtn = document.querySelector('.floating-btn');
    const dialog = document.getElementById('dialogoBusqueda');
    const closeBtn = document.getElementById('cerrarDialogo');

    floatingBtn.addEventListener('click', function () {
        dialog.showModal();
    });

    closeBtn.addEventListener('click', function () {
        dialog.close();
    });

    dialog.addEventListener('click', function (e) {
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

    let todosLosProductos = [];

    const cargarProductos = async () => {
        try {
            const respuesta = await fetch('/equipos/obtener');
            if (!respuesta.ok) throw new Error('Error al obtener productos');
            todosLosProductos = await respuesta.json();
        } catch (error) {
            console.error('Error:', error);
            const tabla = document.querySelector('#tablaProductos tbody');
            tabla.innerHTML = `<tr><td colspan="8">Error al cargar productos: ${error.message}</td></tr>`;
        }
    };

    let busquedaAvanzadaRealizada = false;

    function filtrarProductos() {
        const marca = document.getElementById('filtroMarca').value.toLowerCase();
        const modelo = document.getElementById('filtroModelo').value.toLowerCase();
        const procesador = document.getElementById('filtroProcesador').value.toLowerCase();
        const tamano = document.getElementById('filtroTamano').value.toLowerCase();
        const disco = document.getElementById('filtroDisco').value.toLowerCase();
        const ram = document.getElementById('filtroRam').value.toLowerCase();

        const resultadosAvanzados = todosLosProductos.filter(producto => {
            return (
                (marca === '' || producto.marca.toLowerCase().includes(marca)) &&
                (modelo === '' || producto.modelo.toLowerCase().includes(modelo)) &&
                (procesador === '' || producto.procesador.toLowerCase().includes(procesador)) &&
                (tamano === '' || producto.tamano.toString().includes(tamano)) &&
                (disco === '' || producto.disco.toLowerCase().includes(disco)) &&
                (ram === '' || producto.memoria_ram.toLowerCase().includes(ram))
            );
        });

        const disponibles = resultadosAvanzados.filter(p => p.stock === 'disponible').length;
        const vendidos = resultadosAvanzados.filter(p => p.stock === 'vendido').length;
        const total = resultadosAvanzados.length;

        busquedaAvanzadaRealizada = true;
        mostrarContador(total, disponibles, vendidos);
        renderizarTabla(resultadosAvanzados);
    }

    function mostrarContador(total, disponibles, vendidos) {
        document.getElementById('contadorResultados').textContent = `${total} resultados encontrados`;
        document.getElementById('contadorDisponibles').textContent = `${disponibles} Disponibles`;
        document.getElementById('contadorVendidos').textContent = `${vendidos} Vendidos`;
    }

    function limpiarBusqueda() {
        if (!busquedaAvanzadaRealizada) return;

        document.querySelectorAll('.busqueda-avanzada input').forEach(input => input.value = '');

        const disponibles = todosLosProductos.filter(p => p.stock === 'disponible').length;
        const vendidos = todosLosProductos.filter(p => p.stock === 'vendido').length;
        const total = todosLosProductos.length;

        mostrarContador(total, disponibles, vendidos);
        renderizarTabla(todosLosProductos);

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

    document.querySelectorAll('.busqueda-avanzada input').forEach(input => {
        input.addEventListener('input', filtrarProductos);
    });

    document.getElementById('limpiarBusqueda').addEventListener('click', limpiarBusqueda);

    // Cargar productos al inicio y renderizar
    cargarProductos().then(() => {
        renderizarTabla(todosLosProductos);

        mostrarContador(
            todosLosProductos.length,
            todosLosProductos.filter(p => p.stock === 'disponible').length,
            todosLosProductos.filter(p => p.stock === 'vendido').length
        );
    });
});
