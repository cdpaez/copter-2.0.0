document.addEventListener("DOMContentLoaded", () => {
  // Caso 1: Hardware (deshabilita y limpia si el checkbox está marcado)
  document.querySelectorAll('.input-group-hw').forEach(group => {
    const textInput = group.querySelector('input[type="text"]');
    const checkbox = group.querySelector('input[type="checkbox"]');

    // Inicializar estado
    if (checkbox.checked) {
      textInput.disabled = true;
      textInput.value = '';
    } else {
      textInput.disabled = false;
    }

    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        textInput.disabled = true;
        textInput.value = '';
      } else {
        textInput.disabled = false;
      }
    });
  });

  // Caso 2: Adicionales (habilita si está marcado, limpia y deshabilita si no)
  document.querySelectorAll('.input-group-ad').forEach(group => {
    const textInput = group.querySelector('input[type="text"]');
    const checkbox = group.querySelector('input[type="checkbox"]');

    // Inicializar estado
    if (!checkbox.checked) {
      textInput.disabled = true;
      textInput.value = '';
    } else {
      textInput.disabled = false;
    }

    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        textInput.disabled = false;
      } else {
        textInput.disabled = true;
        textInput.value = '';
      }
    });
  });

  // validacion para el input nota
  const inputNota = document.getElementById('sw_nota');
  const contador = document.getElementById('contador_nota');

  inputNota.addEventListener('input', () => {
    const longitud = inputNota.value.length;
    contador.textContent = `${longitud} / 100`;

    // Limpiar clases previas
    inputNota.classList.remove('valid', 'warn', 'critical');
    contador.classList.remove('warn', 'critical');

    // Aplicar estilos según longitud
    if (longitud > 61) {
      inputNota.classList.add('critical');
      contador.classList.add('critical');
    } else if (longitud > 41) {
      inputNota.classList.add('warn');
      contador.classList.add('warn');
    } else if (longitud > 0) {
      inputNota.classList.add('valid');
    }
  });
  // validacion para el input observaciones
  const textarea = document.getElementById('observaciones');
  const contadorobs = document.getElementById('contadorobs');

  textarea.addEventListener('input', () => {
    contadorobs.textContent = `${textarea.value.length} / 162`;
  });
});
// bloque con funciones utilitarias
function obtenerInspeccionHW(form) {
  return {
    teclado_estado: form.hw_teclado_check.checked,
    teclado_observacion: form.hw_teclado.value,

    mouse_estado: form.hw_mouse_check.checked,
    mouse_observacion: form.hw_mouse.value,

    camara_estado: form.hw_camara_check.checked,
    camara_observacion: form.hw_camara.value,

    pantalla_estado: form.hw_pantalla_check.checked,
    pantalla_observacion: form.hw_pantalla.value,

    parlantes_estado: form.hw_parlantes_check.checked,
    parlantes_observacion: form.hw_parlantes.value,

    bateria_estado: form.hw_bateria_check.checked,
    bateria_observacion: form.hw_bateria.value,

    carcasa_estado: form.hw_carcasa_check.checked,
    carcasa_observacion: form.hw_carcasa.value,

    cargador_estado: form.hw_cargador_check.checked,
    cargador_observacion: form.hw_cargador.value
  };
}
function obtenerInspeccionSW(form) {
  return {
    sistema_operativo: form.sw_sistema_operativo.checked,
    antivirus: form.sw_antivirus.checked,
    office: form.sw_office.checked,
    navegadores: form.sw_navegadores.checked,
    compresores: form.sw_compresores.checked,
    acceso_remoto: form.sw_acceso_remoto.checked,
    nota: form.sw_nota.value
  };
}
function obtenerAdicionales(form) {
  return {
    mouse_estado: form.ad_mouse_check.checked,
    mouse_observacion: form.ad_mouse.value,

    mochila_estado: form.ad_mochila_check.checked,
    mochila_observacion: form.ad_mochila.value,

    estuche_estado: form.ad_estuche_check.checked,
    estuche_observacion: form.ad_estuche.value,

    software1_estado: form.ad_software1_check.checked,
    software1_observacion: form.ad_software1.value,

    software2_estado: form.ad_software2_check.checked,
    software2_observacion: form.ad_software2.value,

    software3_estado: form.ad_software3_check.checked,
    software3_observacion: form.ad_software3.value
  };
}

document.getElementById('actaForm').addEventListener('submit', async (e) => {

  e.preventDefault();
  const form = e.target;

  const usuarioId = parseInt(sessionStorage.getItem('usuarioId'));

  if (!usuarioId || isNaN(usuarioId)) {
    alert('❌ No se pudo obtener el ID del usuario logueado.');
    return;
  }
  // estructurado objeto con los datos del acta
  const datos = {
    cliente: {
      nombre: form.nombre_cliente.value,
      cedula_ruc: form.cedula_ruc.value,
      telefono: form.telefono.value,
      correo: form.correo.value,
      direccion: form.direccion.value
    },
    equipo: parseInt(form.equipo_id.value),
    equipo_detalle: { // ← solo para generar el PDF
      marca: form.marca.value,
      modelo: form.modelo.value,
      numero_serie: form.numero_serie.value,
      procesador: form.procesador.value,
      tamano: form.tamano.value,
      disco: form.disco.value,
      memoria_ram: form.memoria_ram.value,
      tipo_equipo: form.tipo_equipo.value,
      estado: form.estado.value,
      extras: form.extras.value
    },
    inspeccion_hw: obtenerInspeccionHW(form),
    inspeccion_sw: obtenerInspeccionSW(form),
    adicionales: obtenerAdicionales(form),
    acta: {
      forma_pago: form.forma_pago.value,
      precio: parseFloat(form.precio.value),
      usuario_id: usuarioId
    },
    observaciones: form.observaciones.value
  };

  console.log('datos:', datos);

  try {

    // realizamos y guardamos la peticion http en una constante para insertar los datos en sus respectivas tablas
    const res = await fetch('/actas', {

      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)

    });

    // retroalimentacion hacia el usuario

    // si algo falla al momento de intentar guardar el acta
    if (!res.ok) {
      const error = await res.json();
      mostrarToast(error.error || '❌ Error al guardar el acta', 'error');
      return;
    }

    //validacion para observar que datos se estan guardando
    const resultado = await res.json();
    console.log('Respuesta:', resultado);
    mostrarToast('✅ Acta registrada con éxito', 'success');

    // advertencia cuando los productos esten bajos
    if (resultado.advertenciaStock) {
      mostrarToast(resultado.advertenciaStock, 'warning');
    }

    // Abrir el PDF generado en una nueva pestaña (se descarga automáticamente)
    if (resultado.acta_id) {
      window.open(`/actas/${resultado.acta_id}/pdf`, '_self');
    }


  } catch (error) {

    console.error('❌ Error al enviar:', error);
    mostrarToast('❌ Error al guardar el acta', 'error');


  }
});


// bloque encargado de autocompletar los campos luego de buscar un equipo por marca y modelo
const buscarInput = document.getElementById('buscar-equipo');
const resultados = document.getElementById('resultados');
const inputEquipoId = document.getElementById('equipo_id');

let timeout;

buscarInput.addEventListener('input', () => {
  clearTimeout(timeout);
  timeout = setTimeout(async () => {
    const termino = buscarInput.value.trim();
    if (termino.length === 0) {
      return;
    }

    const res = await fetch(`/equipos/buscar?termino=${termino}`);
    const data = await res.json();
    console.log("datos del equipo buscado:", data)

    data.forEach(item => {

      // resultado de la busqueda
      const li = document.createElement('li');
      li.textContent = `${item.marca} - ${item.numero_serie}`;

      // agregando datos a los campos
      li.addEventListener('click', () => {
        // ← completar campos del formulario
        document.querySelector('[name="marca"]').value = item.marca;
        document.querySelector('[name="modelo"]').value = item.modelo;
        document.querySelector('[name="numero_serie"]').value = item.numero_serie;
        document.querySelector('[name="procesador"]').value = item.procesador;
        document.querySelector('[name="tamano"]').value = item.tamano;
        document.querySelector('[name="disco"]').value = item.disco;
        document.querySelector('[name="memoria_ram"]').value = item.memoria_ram;
        document.querySelector('[name="tipo_equipo"]').value = item.tipo_equipo;
        document.querySelector('[name="estado"]').value = item.estado;
        document.querySelector('[name="extras"]').value = item.extras;

        // ← guardar ID del equipo
        inputEquipoId.value = item.id;

        // ← limpiar resultados
        resultados.innerHTML = '';
        buscarInput.value = `${item.marca} - ${item.numero_serie}`;
      });
      resultados.appendChild(li);
    });
  }, 500);
});

// funcion para notificaciones
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

