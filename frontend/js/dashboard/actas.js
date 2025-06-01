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
  async function cargarTablaActas() {
    try {
      const res = await fetch('/actas/resumen');
      console.log('respuesta <-- backend', res);

      if (!res.ok) {
        const error = await res.json();
        console.error('Error al obtener actas:', error);
        alert('❌ Error al cargar el resumen de actas');
        return;
      }

      const actas = await res.json();
      console.log('DATOS EN FORMATO JSON <----', actas);
      if (!Array.isArray(actas)) {
        console.error('Respuesta inválida:', actas);
        alert('❌ La respuesta del servidor no es válida');
        return;
      }

      const tabla = document.getElementById('tabla-actas');
      tabla.innerHTML = '';

      actas.forEach((acta, i) => {
        const fila = `
        <tr>
          <td>${i + 1}</td>
          <td>${new Date(acta.fecha_registro).toLocaleDateString()}</td>
          <td>${acta.Cliente?.nombre || 'Sin cliente'}</td>
          <td>${acta.Equipo?.marca || ''} ${acta.Equipo?.modelo || ''} - ${acta.Equipo?.numero_serie || ''}</td>
          <td>${acta.Usuario?.nombre || ''}</td>
          <td>${acta.forma_pago}</td>
          <td>$${Number(acta.precio).toFixed(2)}</td>
          <td><button class="ver-acta-btn" data-id="${acta.id}">Ver</button></td>
        </tr>
      `;
        tabla.innerHTML += fila;
      });
    } catch (error) {
      console.error('❌ Error de red o procesamiento:', error);
      alert('❌ No se pudo conectar con el servidor');
    }
  }

  function booleanToCheckIcon(value) {
    return value ? '✅' : '❌';
  }

  async function verActa(id) {
    try {
      const res = await fetch(`/actas/${id}`);
      const acta = await res.json();

      const hw = acta.Equipo.InspeccionHardware || {};
      const sw = acta.Equipo.InspeccionSoftware || {};
      const ad = acta.Equipo.Adicional || {};

      const detalle = `
      <p><strong>Fecha:</strong> ${new Date(acta.fecha_registro).toLocaleString()}</p>
      <p><strong>Cliente:</strong> ${acta.Cliente.nombre} - ${acta.Cliente.cedula_ruc}</p>
      <p><strong>Equipo:</strong> ${acta.Equipo.marca} ${acta.Equipo.modelo} - Serie: ${acta.Equipo.numero_serie}</p>
      <p><strong>Vendedor:</strong> ${acta.Usuario.nombre}</p>
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
        <li>Mouse: ${booleanToCheckIcon(ad.mouse)} — ${ad.mouse_observacion || 'Ninguna'}</li>
        <li>Mochila: ${booleanToCheckIcon(ad.mochila)} — ${ad.mochila_observacion || 'Ninguna'}</li>
        <li>Estuche: ${booleanToCheckIcon(ad.estuche)} — ${ad.estuche_observacion || 'Ninguna'}</li>
        <li>Software 1: ${booleanToCheckIcon(ad.software1)} — ${ad.software1_observacion || 'Ninguna'}</li>
        <li>Software 2: ${booleanToCheckIcon(ad.software2)} — ${ad.software2_observacion || 'Ninguna'}</li>
        <li>Software 3: ${booleanToCheckIcon(ad.software3)} — ${ad.software3_observacion || 'Ninguna'}</li>
      </ul>
    `;
      const pintar = document.getElementById('detalleActa')
      pintar.innerHTML = detalle;
      document.getElementById('modalActa').classList.remove('hidden');

    } catch (error) {
      console.error('Error al cargar acta:', error);
      alert('No se pudo cargar el acta');
    }
  }

  cargarTablaActas();

});

