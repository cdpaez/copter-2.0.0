document.addEventListener('DOMContentLoaded', () => {
  // --------------------- ELEMENTOS DEL DOM ---------------------
  const abrirModalBtn = document.getElementById('abrir-modal-usuario');
  const modal = document.getElementById('modal-agregar-usuario');
  const formulario = document.getElementById('form__usuario');
  const cerrarModalBtns = document.querySelectorAll('.cerrar-modal');
  const tituloModal = document.getElementById('titulo-modal-usuario');
  const btnSubmit = formulario.querySelector('button[type="submit"]');
  const buscador = document.getElementById('buscador-usuarios');
  const filtroEstado = document.getElementById('filtro-estado');
  const tablaBody = document.querySelector('.tabla-usuarios tbody');

  // --------------------- ESTADO GLOBAL ---------------------
  const state = {
    modo: 'crear',
    usuarioActual: null,
    cargando: false,
    usuarios: [],
    usuariosFiltrados: []
  };

  // --------------------- FUNCIONES PRINCIPALES ---------------------

  // Función para mostrar/ocultar loading
  const setLoading = (isLoading) => {
    state.cargando = isLoading;
    btnSubmit.innerHTML = isLoading
      ? '<span class="spinner"></span> Procesando...'
      : 'Guardar';
    btnSubmit.disabled = isLoading;
  };

  // Validación de formulario
  const validarFormulario = () => {
    const nombre = document.getElementById('nombre-usuario').value.trim();
    const correo = document.getElementById('correo-usuario').value.trim();
    const rol = document.getElementById('rol-usuario').value;
    const password = document.getElementById('contrasena-usuario').value;

    if (!nombre || !correo || !rol) {
      mostrarToast('Todos los campos son obligatorios', 'error');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      mostrarToast('Correo electrónico inválido', 'error');
      return false;
    }

    if (state.modo === 'crear' && !password) {
      mostrarToast('La contraseña es obligatoria', 'error');
      return false;
    }

    return true;
  };

  // Manejo de formulario unificado
  const manejarEnvioFormulario = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;
    setLoading(true);

    try {
      const formData = {
        nombre: document.getElementById('nombre-usuario').value.trim(),
        correo: document.getElementById('correo-usuario').value.trim(),
        rol_usuario: document.getElementById('rol-usuario').value.toLowerCase(),
        ...(document.getElementById('contrasena-usuario').value && {
          password: document.getElementById('contrasena-usuario').value
        })
      };

      const token = sessionStorage.getItem('token');
      let endpoint, method;

      if (state.modo === 'crear') {
        endpoint = '/usuarios/crear';
        method = 'POST';
      } else {
        endpoint = `/usuarios/actualizar/${state.usuarioActual.id}`;
        method = 'PUT';
        // Si el correo no cambió, lo eliminamos del formData
        if (formData.correo === state.usuarioActual.correo) {
          delete formData.correo;
        }
      }

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.mensaje || 'Error en la operación');

      mostrarToast(
        state.modo === 'crear'
          ? '✅ Usuario creado exitosamente'
          : '✏️ Usuario actualizado correctamente',
        'success'
      );

      cerrarModal();
      await obtenerUsuarios();

    } catch (error) {
      mostrarToast(`❌ ${error.message}`, 'error');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };


  // Obtener lista de usuarios
  const obtenerUsuarios = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch('/usuarios/obtener', {
        method: 'GET',
        headers: {
          'Authorization': token
        }
      });

      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

      const usuarios = await res.json();

      if (!Array.isArray(usuarios)) {
        throw new Error('La respuesta no es un arreglo de usuarios');
      }

      state.usuarios = usuarios;
      filtrarUsuarios();

    } catch (error) {
      mostrarToast("⚠️ Error al cargar usuarios", "error");
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar usuarios por búsqueda y estado
  const filtrarUsuarios = () => {
    const busqueda = buscador.value.toLowerCase();
    const estado = filtroEstado.value;

    state.usuariosFiltrados = state.usuarios.filter(usuario => {
      const coincideNombre = usuario.nombre.toLowerCase().includes(busqueda);
      const coincideCorreo = usuario.correo.toLowerCase().includes(busqueda);
      const coincideEstado = estado ? usuario.estado === estado : true;

      return (coincideNombre || coincideCorreo) && coincideEstado;
    });

    //Mostrar mensaje si no hay resultados
    if (state.usuariosFiltrados.length === 0) {
      tablaBody.innerHTML = '<tr><td colspan="7">No se encontraron usuarios</td></tr>';
    } else {
      renderizarUsuarios(); // solo renderiza si hay resultados
    }

  };

  // --------------------- FUNCIÓN PARA CAMBIAR ESTADO ---------------------
  const cambiarEstadoUsuario = async (id, nuevoEstado) => {
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch(`/usuarios/cambiar-estado/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({ estado: nuevoEstado })
      });

      if (!res.ok) throw new Error('Error al cambiar estado');

      const data = await res.json();
      
      if(nuevoEstado == 'activo'){
        mostrarToast(`Estado cambiado a ${nuevoEstado}`, 'success');
      } else {
        mostrarToast(`Estado cambiado a ${nuevoEstado}`, 'warning');
      }
      
      return data.usuario;

    } catch (error) {
      mostrarToast(`Error: ${error.message}`, 'error');
      console.error('Error:', error);
      return null;
    }
  };
  // --------------------- MODIFICACIÓN EN renderizarUsuarios ---------------------
  const renderizarUsuarios = () => {
    tablaBody.innerHTML = '';

    if (state.usuarios.length === 0) {
      tablaBody.innerHTML = '<tr><td colspan="7">No se encontraron usuarios</td></tr>';
      return;
    }

    state.usuariosFiltrados.forEach(usuario => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${usuario.id}</td>
        <td>${usuario.nombre}</td>
        <td>${usuario.correo}</td>
        <td><span class="badge ${usuario.rol_usuario}">${usuario.rol_usuario}</span></td>
        <td class="estado-toggle">
          <label class="switch">
            <input type="checkbox" ${usuario.estado === 'activo' ? 'checked' : ''} 
            data-id="${usuario.id}">
            <span class="slider round"></span>
            <span class="estado-texto">${usuario.estado}</span>
          </label>
        </td>
        <td class="acciones">
          <button class="btn-editar-usuario" data-id="${usuario.id}">✏️ Editar</button>
          <button class="btn-eliminar-usuario" data-id="${usuario.id}">🗑️ Eliminar</button>
        </td>
      `;
      tablaBody.appendChild(fila);
    });
    // Agregar event listeners a los toggles
    document.querySelectorAll('.estado-toggle input').forEach(toggle => {
      toggle.addEventListener('change', async (e) => {
        const id = e.target.getAttribute('data-id');
        const nuevoEstado = e.target.checked ? 'activo' : 'inactivo';

        const usuarioActualizado = await cambiarEstadoUsuario(id, nuevoEstado);

        if (usuarioActualizado) {
          // Actualizar estado en el array local
          const index = state.usuarios.findIndex(u => u.id == id);
          if (index !== -1) {
            state.usuarios[index].estado = usuarioActualizado.estado;
          }

          // Actualizar texto visual
          const textoEstado = e.target.parentElement.querySelector('.estado-texto');
          textoEstado.textContent = usuarioActualizado.estado;
          textoEstado.className = `estado-texto ${usuarioActualizado.estado}`;
        } else {
          // Revertir el cambio si falla
          e.target.checked = !e.target.checked;
        }
      });
    });
  };

  // Cargar datos para edición
  const cargarParaEdicion = async (id) => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch(`/usuarios/obtener/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) throw new Error(res.status === 404 ? 'Usuario no encontrado' : 'Error al cargar usuario');

      const usuario = await res.json();
      state.usuarioActual = usuario;
      state.modo = 'editar';

      document.getElementById('nombre-usuario').value = usuario.nombre;
      document.getElementById('correo-usuario').value = usuario.correo;
      document.getElementById('rol-usuario').value = usuario.rol_usuario;
      document.getElementById('contrasena-usuario').value = '';
      document.getElementById('contrasena-usuario').removeAttribute('required');

      tituloModal.textContent = 'Editar Usuario';
      modal.style.display = 'flex';

    } catch (error) {
      mostrarToast(`❌ ${error.message}`, 'error');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar usuario
  const eliminarUsuario = async (id) => {
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
      const res = await fetch(`/usuarios/eliminar/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) throw new Error('Error al eliminar');

      mostrarToast('🗑️ Usuario eliminado correctamente', 'success');
      await obtenerUsuarios();

    } catch (error) {
      mostrarToast(`❌ ${error.message}`, 'error');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cerrar modal
  const cerrarModal = () => {
    formulario.reset();
    document.getElementById('contrasena-usuario').setAttribute('required', '');
    modal.style.display = 'none';
    state.usuarioActual = null;
    state.modo = 'crear';
    tituloModal.textContent = 'Nuevo Usuario';
  };

  // --------------------- EVENT LISTENERS ---------------------
  abrirModalBtn.addEventListener('click', () => {
    state.modo = 'crear';
    tituloModal.textContent = 'Nuevo Usuario';
    formulario.reset();
    document.getElementById('contrasena-usuario').setAttribute('required', '');
    modal.style.display = 'flex';
  });

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-editar-usuario')) {
      cargarParaEdicion(e.target.getAttribute('data-id'));
    }

    if (e.target.classList.contains('btn-eliminar-usuario')) {
      eliminarUsuario(e.target.getAttribute('data-id'));
    }
  });

  cerrarModalBtns.forEach(btn => {
    btn.addEventListener('click', cerrarModal);
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) cerrarModal();
  });

  formulario.addEventListener('submit', manejarEnvioFormulario);

  // Filtrado de usuarios
  buscador.addEventListener('input', filtrarUsuarios);
  filtroEstado.addEventListener('change', filtrarUsuarios);

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
  // --------------------- INICIALIZACIÓN ---------------------
  obtenerUsuarios();
});