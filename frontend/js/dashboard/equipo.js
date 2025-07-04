document.addEventListener('DOMContentLoaded', () => {
  // Ajusta si tu backend usa otra ruta
  const tablaProductos = document.querySelector('.tabla-productos tbody');
  // 1. Función para abrir el modal en modo "añadir"
  document.getElementById('abrir-modal').addEventListener('click', () => {
    abrirModalCreacion();
  });

  const abrirModalCreacion = () => {
    const form = document.getElementById('form-modal-producto');
    form.reset();
    form.dataset.modo = 'creacion'; // Establecer modo creación
    form.removeAttribute('data-id'); // Limpiar ID si existe
    document.getElementById('titulo-modal-producto').textContent = 'Agregar Nuevo Producto';
    document.getElementById('modal-producto').style.display = 'flex';
    document.getElementById('codigo_prd').focus(); // Enfocar el primer campo
  };
  // 2. bloque encargado de obtener todos los productos de la base de datos
  let todosLosProductos = [];
  const cargarProductos = async () => {

    try {
      const respuesta = await fetch('/equipos/obtener');
      if (!respuesta.ok) throw new Error('Error al obtener productos');


      todosLosProductos = await respuesta.json(); // Guardamos todos los productos

      mostrarProductos(todosLosProductos); // Mostramos todos inicialmente

    } catch (error) {

      console.error('Error:', error);
      tablaProductos.innerHTML = `<tr><td colspan="7">Error al cargar productos: ${error.message}</td></tr>`;
      mostrarToast('❌ Error al cargar productos', 'error');
    }
  };

  // 3. bloque encargado de búsqueda en tiempo real
  document.getElementById('buscador-productos').addEventListener('input', (e) => {
    // Obtener valores de cada input y pasarlos a minúscula para hacer la búsqueda case insensitive
    const termino = e.target.value.toLowerCase().trim();

    if (!termino) {
      mostrarProductos(todosLosProductos); // Si no hay término, mostrar todos
      return;
    }

    // Filtrar productos
    const resultados = todosLosProductos.filter(producto =>
      producto.codigo_prd.toLowerCase().includes(termino) ||
      producto.precio.toString().includes(termino)
    );

    paginaActual = 1;
    mostrarProductos(resultados);
  });
  // bandera para ejecutar la busqueda
  let busquedaAvanzadaRealizada = false;

  function filtrarProductos() {
    // Obtener valores de cada input y pasarlos a minúscula para hacer la búsqueda case insensitive
    const marca = document.getElementById('filtroMarca').value.toLowerCase();
    const modelo = document.getElementById('filtroModelo').value.toLowerCase();
    const procesador = document.getElementById('filtroProcesador').value.toLowerCase();
    const tamano = document.getElementById('filtroTamano').value.toLowerCase();
    const disco = document.getElementById('filtroDisco').value.toLowerCase();
    const ram = document.getElementById('filtroRam').value.toLowerCase();

    // Filtrar con todas las condiciones, ignorando filtros vacíos
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
    // Contar disponibilidad
    const disponibles = resultadosAvanzados.filter(p => p.stock === 'disponible').length;
    const vendidos = resultadosAvanzados.filter(p => p.stock === 'vendido').length;
    const total = resultadosAvanzados.length;

    busquedaAvanzadaRealizada = true;
    paginaActual = 1;
    mostrarProductos(resultadosAvanzados);
    mostrarContador(total, disponibles, vendidos);
  }
  function mostrarContador(total, disponibles, vendidos) {
    document.getElementById('contadorResultados').textContent = `${total} resultados encontrados`;
    document.getElementById('contadorDisponibles').textContent = `${disponibles} Disponibles`;
    document.getElementById('contadorVendidos').textContent = `${vendidos} Vendidos`;
  }

  document.querySelectorAll('.busqueda-avanzada input').forEach(input => {
    input.addEventListener('input', filtrarProductos);
  });

  // Función para limpiar la búsqueda
  function limpiarBusqueda() {

    if (!busquedaAvanzadaRealizada) {
      console.log('No se ha realizado una búsqueda avanzada, nada que limpiar.');
      return;
    }
    console.log('Limpiando búsqueda...');

    // Obtener todos los inputs de búsqueda
    const inputs = document.querySelectorAll('.busqueda-avanzada input');

    // Limpiar cada input
    inputs.forEach(input => {
      input.value = '';
      console.log(`Input ${input.id} limpiado`);
    });

    // Mostrar todos los productos sin filtros
    paginaActual = 1;
    mostrarProductos(todosLosProductos);

    // Actualizar contadores con todos los productos
    const disponibles = todosLosProductos.filter(p => p.stock === 'disponible').length;
    const vendidos = todosLosProductos.filter(p => p.stock === 'vendido').length;
    const total = todosLosProductos.length;

    mostrarContador(total, disponibles, vendidos);
    busquedaAvanzadaRealizada = false;
    console.log('Búsqueda limpiada, mostrando todos los productos');
  }

  // Asignar evento al botón Limpiar
  document.getElementById('limpiarBusqueda').addEventListener('click', limpiarBusqueda);

  // paginacion
  let paginaActual = 1;
  const productosPorPagina = 20;
  // Función para mostrar productos (optimizada)
  const mostrarProductos = (productos) => {
    tablaProductos.innerHTML = ''; // Limpiar tabla

    if (productos.length === 0) {
      tablaProductos.innerHTML = '<tr><td colspan="7">No se encontraron productos</td></tr>';
      return;
    }
    // Calcular el rango de productos que se deben mostrar
    const inicio = (paginaActual - 1) * productosPorPagina;
    const fin = inicio + productosPorPagina;
    const productosPagina = productos.slice(inicio, fin);

    productosPagina.forEach(producto => {
      const fila = document.createElement('tr');
      // Determinar la clase según el valor del stock
      const claseStock = producto.stock.toLowerCase() === 'disponible' ? 'stock-disponible' : 'stock-vendido';
      fila.innerHTML = `
      <td>${producto.codigo_prd}</td>
      <td class="${claseStock}">${producto.stock}</td>
      <td>${producto.precio}</td>
      <td>${producto.marca}</td>
      <td>${producto.modelo}</td>
      <td>${producto.numero_serie}</td>
      <td>${producto.procesador}</td>
      <td>${producto.tamano}</td>
      <td>${producto.disco}</td>
      <td>${producto.memoria_ram}</td>
      <td>${producto.tipo_equipo}</td>
      <td>${producto.estado}</td>
      <td>${producto.extras}</td>
      <td>${new Date(producto.fecha).toLocaleDateString()}</td>
      <td class="acciones">
        <button class="btn-editar" data-id="${producto.id}">✏️ Editar</button>
        <button class="btn-eliminar" data-id="${producto.id}">🗑️ Eliminar</button>
      </td>
    `;
      tablaProductos.appendChild(fila);
    });

    // Reasignar eventos (importante después de filtrar)
    asignarEventosBotones();
    mostrarPaginacion(productos);
  };
  // mostrar paginacion
  const mostrarPaginacion = (productos) => {
    const totalPaginas = Math.ceil(productos.length / productosPorPagina);
    const contenedor = document.getElementById('paginacion');
    contenedor.innerHTML = '';

    for (let i = 1; i <= totalPaginas; i++) {
      const btn = document.createElement('button');
      btn.textContent = i;
      if (i === paginaActual) {
        btn.classList.add('activa');
      }
      btn.addEventListener('click', () => {
        paginaActual = i;
        mostrarProductos(productos);
      });
      contenedor.appendChild(btn);
    }
  };

  // Función para asignar eventos a los botones (si no la tienes)
  const asignarEventosBotones = () => {
    document.querySelectorAll('.btn-editar').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        editarProducto(id);
      });
    });

    document.querySelectorAll('.btn-eliminar').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        eliminarProducto(id);
      });
    });
  };
  // Función para eliminar producto
  const eliminarProducto = async (id) => {
    // Mostrar modal de confirmación personalizado
    const confirmarEliminacion = () => {
      return new Promise((resolve) => {
        const toastConfirmacion = document.createElement('div');
        toastConfirmacion.className = 'toast-confirm';
        toastConfirmacion.innerHTML = `
          <div class="toast-confirm-content">
            <p>¿Eliminar este producto?</p>
            <div class="toast-confirm-buttons">
              <button id="toast-confirmar">Sí, eliminar</button>
              <button id="toast-cancelar">Cancelar</button>
            </div>
          </div>
        `;

        document.body.appendChild(toastConfirmacion);

        document.getElementById('toast-confirmar').addEventListener('click', () => {
          toastConfirmacion.remove();
          resolve(true);
        });

        document.getElementById('toast-cancelar').addEventListener('click', () => {
          toastConfirmacion.remove();
          resolve(false);
        });
      });
    };

    // Verificar confirmación
    const usuarioConfirmo = await confirmarEliminacion();
    if (!usuarioConfirmo) return;

    try {
      const token = sessionStorage.getItem('token');
      if (!token) throw new Error('Autenticación requerida');

      const respuesta = await fetch(`/equipos/eliminar/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token
        }
      });

      if (!respuesta.ok) {
        throw new Error('Error al eliminar el producto');
      }

      mostrarToast('✅ Producto eliminado correctamente', 'success');
      cargarProductos();

    } catch (error) {
      console.error('Error:', error);
      mostrarToast(`❌ ${error.message}`, 'error');
    }
  };

  // bloque encargado de agregar un nuevo producto o de editarlo 
  const editarProducto = async (id) => {
    try {
      const token = sessionStorage.getItem('token')
      if (!token) throw new Error('No hay token de autenticación');
      // 1. Obtener datos del producto desde tu endpoint
      const response = await fetch(`/equipos/obtener/${id}`, {
        headers: {
          'Authorization': token // 👈 Envía el token
        }
      });
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.mensaje || 'Error al cargar producto');
      }

      const producto = result.data;

      // 2. Poblar el formulario del modal
      document.getElementById('codigo_prd').value = producto.codigo_prd || 0;
      document.getElementById('precio').value = producto.precio || 0;
      document.getElementById('marca').value = producto.marca || '';
      document.getElementById('modelo').value = producto.modelo || '';
      document.getElementById('serie').value = producto.numero_serie || '';
      document.getElementById('procesador').value = producto.procesador || '';
      document.getElementById('tamano').value = producto.tamano || '';
      document.getElementById('disco').value = producto.disco || ''; // corresponde al input con id="disco"
      document.getElementById('ram').value = producto.memoria_ram || '';
      document.getElementById('tipo').value = producto.tipo_equipo || '';
      document.getElementById('estado').value = producto.estado || '';
      document.getElementById('extras').value = producto.extras || '';


      // 3. Configurar el formulario para edición
      const form = document.getElementById('form-modal-producto');
      form.dataset.modo = 'edicion';
      form.dataset.id = id;
      document.getElementById('titulo-modal-producto').textContent = 'Editar Producto';

      // 4. Mostrar el modal
      document.getElementById('modal-producto').style.display = 'flex';

    } catch (error) {
      console.error('Error al cargar producto:', error);
      mostrarToast(`Error: ${error.message}`, 'error');
    }
  };

  const manejarSubmitProducto = async (e) => {
    e.preventDefault();
    const form = e.target;
    const esEdicion = form.dataset.modo === 'edicion';
    const token = sessionStorage.getItem('token');
    const loader = document.getElementById('loader-modal');

    try {
      // Validaciones
      if (!token) throw new Error('Debes iniciar sesión primero');
      if (!form.checkValidity()) throw new Error('Completa todos los campos requeridos');

      // Mostrar loader
      loader.style.display = 'block';
      const btnGuardar = form.querySelector('button[type="submit"]');
      btnGuardar.disabled = true;

      // Preparar datos
      const datos = {
        codigo_prd: form.codigo_prd.value,
        precio: parseFloat(form.precio.value),
        marca: form.marca.value.trim(),
        modelo: form.modelo.value.trim(),
        numero_serie: form.serie.value.trim(),
        procesador: form.procesador.value.trim(),
        tamano: form.tamano.value.trim(),
        disco: form.disco.value.trim(),
        memoria_ram: form.ram.value.trim(),
        tipo_equipo: form.tipo.value.trim(),
        estado: form.estado.value.trim(),
        extras: form.extras.value.trim()
      };

      // Validación adicional
      if (datos.precio <= 0) {
        throw new Error('Precio debe ser un valor positivo');
      }

      // Configurar petición
      const url = esEdicion ? `/equipos/actualizar/${form.dataset.id}` : '/equipos/crear';
      const method = esEdicion ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(datos)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Respuesta con error:', errorData);
        throw new Error(errorData.error || 'Error en la solicitud');
      }

      // Éxito
      mostrarToast(
        esEdicion ? '✅ Producto actualizado' : '✅ Producto creado',
        'success'
      );
      document.getElementById('modal-producto').style.display = 'none';
      cargarProductos();

    } catch (error) {

      console.error('Error:', error);
      mostrarToast(`❌ ${error.message}`, 'error');

    } finally {

      loader.style.display = 'none';
      const btnGuardar = form.querySelector('button[type="submit"]');
      if (btnGuardar) btnGuardar.disabled = false;

    }
  };

  // Asignar evento al formulario
  document.getElementById('form-modal-producto').addEventListener('submit', manejarSubmitProducto);

  document.querySelector('.cerrar-modal').addEventListener('click', () => {
    document.getElementById('modal-producto').style.display = 'none';
    document.getElementById('form-modal-producto').reset(); // Limpiar formulario
  });

  function mostrarToast(mensaje, tipo = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');

    toast.className = `toast ${tipo}`;
    toast.textContent = mensaje;

    container.appendChild(toast);

    // Eliminar el toast después de la animación
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  // Abrir modal de importación
  document.getElementById('importar-datos').addEventListener('click', () => {
    document.getElementById('modal-importar').style.display = 'flex';
  });

  // Cerrar modal al hacer clic en el fondo o en cancelar
  document.getElementById('modal-importar').addEventListener('click', (e) => {
    if (e.target === document.getElementById('modal-importar') ||
      e.target.classList.contains('cerrar-modal')) {
      document.getElementById('modal-importar').style.display = 'none';
    }
  });

  // Cerrar modal con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' &&
      document.getElementById('modal-importar').style.display === 'flex') {
      document.getElementById('modal-importar').style.display = 'none';
    }
  });


  // Función para importar productos
  document.getElementById('form-importar').addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = e.target;
    const fileInput = form.archivo;
    const token = sessionStorage.getItem('token');

    if (!fileInput.files.length) {
      mostrarToast('❌ Selecciona un archivo', 'error');
      return;
    }

    try {
      // Mostrar loader
      const loader = document.createElement('div');
      loader.className = 'loader';
      form.appendChild(loader);
      form.querySelector('button[type="submit"]').disabled = true;

      // Crear FormData
      const formData = new FormData();
      formData.append('archivo', fileInput.files[0]);

      // Enviar archivo
      const response = await fetch(`/equipos/importar`, {
        method: 'POST',
        headers: {
          'Authorization': token // Token JWT
        },
        body: formData // No Content-Type para FormData!
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || 'Error al importar');

      // Éxito
      mostrarToast(
        `✅ Importados ${result.importados} de ${result.total} productos` +
        (result.duplicados > 0 ? ` (${result.duplicados} duplicados omitidos)` : ''),
        'success'
      );

      document.getElementById('modal-importar').style.display = 'none';
      cargarProductos(); // Actualizar tabla

    } catch (error) {
      console.error('Error:', error);
      mostrarToast(`❌ ${error.message}`, 'error');
    } finally {
      // Limpiar
      form.reset();
      const loader = form.querySelector('.loader');
      if (loader) loader.remove();
      form.querySelector('button[type="submit"]').disabled = false;
    }
  });
  // Cargar productos al iniciar
  cargarProductos();

  const dialogo = document.getElementById("dialogoBusqueda");
  const abrir = document.getElementById("abrirDialogo");
  const cerrar = document.getElementById("cerrarDialogo");

  abrir.addEventListener("click", () => {
    dialogo.showModal();
  });

  cerrar.addEventListener("click", () => {
    dialogo.close();
  });
  // Cerrar al hacer clic fuera del contenido
  dialogo.addEventListener("click", (e) => {
    const rect = dialogo.getBoundingClientRect();
    const clickedOutside =
      e.clientX < rect.left || e.clientX > rect.right ||
      e.clientY < rect.top || e.clientY > rect.bottom;

    if (clickedOutside) {
      dialogo.close();
    }
  });
});