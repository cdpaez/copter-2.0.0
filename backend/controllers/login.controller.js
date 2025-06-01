const { Usuario } = require('../models');
const jwt = require('jsonwebtoken')
const { mapperUserLogin } = require('../mappers/usuario.mapper');

const login = async (req, res) => {
  const { correo, password } = req.body;

  try {
    const usuario = await Usuario.findOne(
      {
        where: { correo }
      });
    
    if (!usuario) {
      return res.status(404).json(
        { 
          mensaje: 'No encontramos tu cuenta' 
        });
    }

    console.log(usuario.get({ plain: true }));

    // Comparamos la contraseña (esta parte la hacemos simple por ahora)
    if (usuario.password !== password) {

      return res.status(401).json(
        { 
          mensaje: 'Contraseña incorrecta' 
        });
    }
    // si pasa esas dos validaciones quiere decir que el usuario existe y que la contrasena es correcta
    // aqui es cuando se mapea el como se obtiene los datos de la peticion GET

    const userMapped = mapperUserLogin(usuario);

    // Generamos el token JWT (podemos incluir el id y rol si es necesario)
    const token = jwt.sign(
      {
        id: userMapped.id,
        rol: userMapped.rol
      },
      'secreto',// Clave secreta (cámbiala por algo más seguro)
      {
        expiresIn: '1h'// El token expirará en 1 hora 
      }
    );

    // determinar la ruta de redirecion basada en roles
    let redirectPath = 'pages/dashboard.html'; // Valor por defecto
    if (userMapped.rol === 'vendedor') {
      redirectPath = 'pages/operador.html'; // Redirigir a la página de operador si el rol es operador
    }
    // Usuario encontrado
    res.status(200).json(
      {
        mensaje: 'Login exitoso',
        token,
        rol: userMapped.rol,
        id: userMapped.id,
        redirect: redirectPath
      });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json(
      {
        mensaje: 'Error del servidor'
      });
  }
};

module.exports = { login };