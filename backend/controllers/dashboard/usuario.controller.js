const { Usuario } = require('../../models');

const crearUsuario = async (req, res) => {
  try {
    const nuevoUsuario = await Usuario.create(req.body);
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ mensaje: 'Error al crear usuario', error });
  }
};

const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.status(200).json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ mensaje: 'Error al obtener usuarios', error });
  }
};

const obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.status(200).json(usuario);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ mensaje: 'Error al obtener usuario', error });
  }
};

const actualizarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    await usuario.update(req.body);
    res.status(200).json(usuario);
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ mensaje: 'Error al actualizar usuario', error });
  }
};
// Controlador para cambiar estado
const cambiarEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    // Validar que el estado sea válido
    if (!['activo', 'inactivo'].includes(estado)) {
      return res.status(400).json({
        success: false,
        mensaje: 'Estado inválido. Use "activo" o "inactivo"'
      });
    }

    const usuario = await Usuario.findByPk(id);
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    // Solo actualiza el estado
    await usuario.update({ estado });

    res.json({
      success: true,
      usuario,
      mensaje: `Estado cambiado a ${estado}`
    });

  } catch (error) {
    console.error('Error al cambiar estado:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error interno al cambiar estado'
    });
  }
};

const eliminarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    await usuario.destroy();
    res.status(200).json({ mensaje: 'Usuario eliminado' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ mensaje: 'Error al eliminar usuario', error });
  }
};

module.exports = {
  crearUsuario,
  obtenerUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario,
  cambiarEstado
};
