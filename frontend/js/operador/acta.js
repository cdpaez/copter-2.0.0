document.getElementById('actaForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const form = e.target;

  const usuarioId = parseInt(sessionStorage.getItem('usuarioId'));

  if (!usuarioId || isNaN(usuarioId)) {
    alert('❌ No se pudo obtener el ID del usuario logueado.');
    return;
  }

  const datos = {
    cliente: {
      nombre: form.nombre_cliente.value,
      cedula_ruc: form.cedula_ruc.value,
      telefono: form.telefono.value,
      correo: form.correo.value,
      direccion: form.direccion.value
    },
    equipo: parseInt(form.equipo_id.value),
    inspeccion_hw: {
      teclado: form.hw_teclado_check.checked,
      teclado_obs: form.hw_teclado.value,
      mouse: form.hw_mouse_check.checked,
      mouse_obs: form.hw_mouse.value,
      camara: form.hw_camara_check.checked,
      camara_obs: form.hw_camara.value,
      pantalla: form.hw_pantalla_check.checked,
      pantalla_obs: form.hw_pantalla.value,
      parlantes: form.hw_parlantes_check.checked,
      parlantes_obs: form.hw_parlantes.value,
      bateria: form.hw_bateria_check.checked,
      bateria_obs: form.hw_bateria.value,
      carcasa: form.hw_carcasa_check.checked,
      carcasa_obs: form.hw_carcasa.value,
      cargador: form.hw_cargador_check.checked,
      cargador_obs: form.hw_cargador.value
    },
    inspeccion_sw: {
      sistema_operativo: form.sw_sistema_operativo.checked,
      antivirus: form.sw_antivirus.checked,
      office: form.sw_office.checked,
      navegadores: form.sw_navegadores.checked,
      compresores: form.sw_compresores.checked,
      acceso_remoto: form.sw_acceso_remoto.checked,
      nota: form.sw_nota.value
    },
    adicionales: {
      mouse: form.ad_mouse_check.checked,
      mouse_obs: form.ad_mouse.value,
      mochila: form.ad_mochila_check.checked,
      mochila_obs: form.ad_mochila.value,
      estuche: form.ad_estuche_check.checked,
      estuche_obs: form.ad_estuche.value,
      software1: form.ad_software1_check.checked,
      software1_obs: form.ad_software1.value,
      software2: form.ad_software2_check.checked,
      software2_obs: form.ad_software2.value,
      software3: form.ad_software3_check.checked,
      software3_obs: form.ad_software3.value
    },
    acta: {
      forma_pago: form.forma_pago.value,
      precio: parseFloat(form.precio.value),
      usuario_id: usuarioId
    },
    observaciones: form.observaciones.value
  };
  console.log('datos:', datos);
  try {
    const res = await fetch('/actas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });

    const resultado = await res.json();
    console.log('Respuesta:', resultado);
    alert('✅ Acta registrada con éxito');
  } catch (error) {
    console.error('❌ Error al enviar:', error);
    alert('❌ Error al registrar acta');
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
      resultados.innerHTML = '';
      return;
    }


    const res = await fetch(`/equipos/buscar?termino=${termino}`);
    const data = await res.json();

    resultados.innerHTML = '';
    data.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.marca} - ${item.numero_serie}`;
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