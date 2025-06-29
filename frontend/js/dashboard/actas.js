document.addEventListener('DOMContentLoaded', () => {
  // Abrir el modal al hacer clic en cualquier botón con clase .ver-acta-btn
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('ver-acta-btn')) {
      const id = e.target.getAttribute('data-id');
      verActa(id); // función que llena el contenido del modal
      document.getElementById('modalActa').classList.remove('hidden');
    }
  });

  // Cerrar el modal al hacer clic en la X
  document.getElementById('cerrarModal').addEventListener('click', () => {
    document.getElementById('modalActa').classList.add('hidden');
  });

  // Cerrar el modal al hacer clic fuera del contenido
  document.getElementById('modalActa').addEventListener('click', (e) => {
    if (e.target.id === 'modalActa') {
      document.getElementById('modalActa').classList.add('hidden');
    }
  });

  let actasOriginales = [];

  async function cargarTablaActas() {
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch('/actas/resumen', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const error = await res.json();
        console.error('Error al obtener actas:', error);
        alert('❌ Error al cargar el resumen de actas');
        return;
      }

      const actas = await res.json();
      if (!Array.isArray(actas)) {
        console.error('Respuesta inválida:', actas);
        alert('❌ La respuesta del servidor no es válida');
        return;
      }

      actasOriginales = actas; // ✅ Guardamos para aplicar filtros después
      renderizarTablaActas(actasOriginales);

    } catch (error) {
      console.error('❌ Error de red o procesamiento:', error);
      alert('❌ No se pudo conectar con el servidor');
    }
  }

  function renderizarTablaActas(lista) {

    const tabla = document.getElementById('tabla-actas');
    tabla.innerHTML = '';

    if (lista.length === 0) {
      tabla.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center; padding: 1rem; color: #666;">
          🛈 No existen actas registradas en ese rango de fechas.
        </td>
      </tr>
    `;
      return;
    }

    lista.forEach(acta => {

      const fila = `
      <tr>
        <td>${acta.id}</td>
        <td>${new Date(acta.fecha_registro).toLocaleDateString()}</td>
        <td>${acta.cliente_nombre || 'Sin cliente'}</td>
        <td>${acta.equipo_marca || ''} ${acta.equipo_modelo || ''} - ${acta.equipo_numero_serie || ''}</td>
        <td>${acta.vendedor_nombre || ''}</td>
        <td>${acta.forma_pago}</td>
        <td>$${Number(acta.precio).toFixed(2)}</td>
        <td><button class="ver-acta-btn" data-id="${acta.id}">Ver</button></td>
      </tr>
    `;
      tabla.innerHTML += fila;
    });
  }

  function booleanToCheckIcon(value) {
    return value ? '✅' : '❌';
  }

  async function verActa(id) {
    try {
      const token = sessionStorage.getItem('token'); // Obtener token
      const res = await fetch(`/actas/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const acta = await res.json();
      console.log('datos de las actas', acta);

      const hw = acta.inspeccion_hw || {};
      const sw = acta.inspeccion_sw || {};
      const ad = acta.adicionales || {};

      let detalle = `
      <p><strong>Fecha:</strong> ${new Date(acta.fecha_registro).toLocaleString()}</p>
      <p><strong>Cliente:</strong> ${acta.cliente_nombre} - ${acta.cliente_cedula}</p>
      <p><strong>Equipo:</strong> ${acta.equipo_marca} ${acta.equipo_modelo} - Serie: ${acta.equipo_numero_serie}</p>
      <p><strong>Vendedor:</strong> ${acta.vendedor_nombre}</p>
      <p><strong>Forma de pago:</strong> ${acta.forma_pago}</p>
      <p><strong>Precio:</strong> $${Number(acta.precio).toFixed(2)}</p>
      <p><strong>Observaciones:</strong> ${acta.observaciones || 'Ninguna'}</p>

      <h3>Inspección de Hardware</h3>
      <ul>
        <li>Teclado: ${booleanToCheckIcon(hw.teclado_estado)} — ${hw.teclado_observacion || 'Ninguna'}</li>
        <li>Mouse: ${booleanToCheckIcon(hw.mouse_estado)} — ${hw.mouse_observacion || 'Ninguna'}</li>
        <li>Cámara: ${booleanToCheckIcon(hw.camara_estado)} — ${hw.camara_observacion || 'Ninguna'}</li>
        <li>Pantalla: ${booleanToCheckIcon(hw.pantalla_estado)} — ${hw.pantalla_observacion || 'Ninguna'}</li>
        <li>Parlantes: ${booleanToCheckIcon(hw.parlantes_estado)} — ${hw.parlantes_observacion || 'Ninguna'}</li>
        <li>Batería: ${booleanToCheckIcon(hw.bateria_estado)} — ${hw.bateria_observacion || 'Ninguna'}</li>
        <li>Carcasa: ${booleanToCheckIcon(hw.carcasa_estado)} — ${hw.carcasa_observacion || 'Ninguna'}</li>
        <li>Cargador: ${booleanToCheckIcon(hw.cargador_estado)} — ${hw.cargador_observacion || 'Ninguna'}</li>
      </ul>

      <h3>Inspección de Software</h3>
      <ul>
        <li>Sistema Operativo: ${booleanToCheckIcon(sw.sistema_operativo)}</li>
        <li>Antivirus: ${booleanToCheckIcon(sw.antivirus)}</li>
        <li>Office: ${booleanToCheckIcon(sw.office)}</li>
        <li>Navegadores: ${booleanToCheckIcon(sw.navegadores)}</li>
        <li>Compresores: ${booleanToCheckIcon(sw.compresores)}</li>
        <li>Acceso Remoto: ${booleanToCheckIcon(sw.acceso_remoto)}</li>
        <li>Nota: ${sw.nota || 'Ninguna'}</li>
      </ul>

      <h3>Adicionales</h3>
      <ul>
        <li>Mouse: ${booleanToCheckIcon(ad.mouse_estado)} — ${ad.mouse_observacion || 'Ninguna'}</li>
        <li>Mochila: ${booleanToCheckIcon(ad.mochila_estado)} — ${ad.mochila_observacion || 'Ninguna'}</li>
        <li>Estuche: ${booleanToCheckIcon(ad.estuche_estado)} — ${ad.estuche_observacion || 'Ninguna'}</li>
        <li>Software 1: ${booleanToCheckIcon(ad.software1_estado)} — ${ad.software1_observacion || 'Ninguna'}</li>
        <li>Software 2: ${booleanToCheckIcon(ad.software2_estado)} — ${ad.software2_observacion || 'Ninguna'}</li>
        <li>Software 3: ${booleanToCheckIcon(ad.software3_estado)} — ${ad.software3_observacion || 'Ninguna'}</li>
      </ul>
      <button id="descargarActaPDF" style="margin-top: 1rem;">Descargar PDF generado</button>
      `;
      const pintar = document.getElementById('detalleActa');
      pintar.innerHTML = detalle;
      document.querySelectorAll('#detalleActa ul').forEach(ul => {
        ul.classList.add('dos-columnas');
      });
      document.getElementById('modalActa').classList.remove('hidden');

    } catch (error) {
      console.error('Error al cargar acta:', error);
      alert('No se pudo cargar el acta');
    }
  }

  document.getElementById('fecha-inicio').addEventListener('change', aplicarFiltros);
  document.getElementById('fecha-fin').addEventListener('change', aplicarFiltros);
  document.getElementById('buscador-ventas').addEventListener('input', aplicarFiltros);

  function aplicarFiltros() {
    const desde = document.getElementById('fecha-inicio').value;
    const hasta = document.getElementById('fecha-fin').value;
    const busqueda = document.getElementById('buscador-ventas').value.trim().toLowerCase();

    const desdeDate = desde ? new Date(desde + 'T00:00:00') : null;
    const hastaDate = hasta ? new Date(hasta + 'T23:59:59.999') : null;

    const filtradas = actasOriginales.filter((acta) => {
      const fechaUTC = new Date(acta.fecha_registro);

      // Convertir a fecha local (evita errores por desfase horario)
      const fechaActa = new Date(
        fechaUTC.getFullYear(),
        fechaUTC.getMonth(),
        fechaUTC.getDate(),
        fechaUTC.getHours(),
        fechaUTC.getMinutes(),
        fechaUTC.getSeconds(),
        fechaUTC.getMilliseconds()
      );

      // Filtro por fechas
      if (desdeDate && fechaActa < desdeDate) return false;
      if (hastaDate && fechaActa > hastaDate) return false;

      // Filtro por texto (cliente, vendedor, producto)
      const cliente = acta.cliente_nombre?.toLowerCase() || '';
      const vendedor = acta.vendedor_nombre?.toLowerCase() || '';
      const producto = `${acta.equipo_marca || ''} ${acta.equipo_modelo || ''} ${acta.equipo_numero_serie || ''}`.toLowerCase();

      if (
        !cliente.includes(busqueda) &&
        !vendedor.includes(busqueda) &&
        !producto.includes(busqueda)
      ) {
        return false;
      }

      return true;
    });

    renderizarTablaActas(filtradas);
  }

  document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'descargarActaPDF') {
      const contenido = document.getElementById('detalleActa');

      const opciones = {
        margin: 10,
        filename: `acta`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      html2pdf().set(opciones).from(contenido).save();
    }
  });

  cargarTablaActas();

});

