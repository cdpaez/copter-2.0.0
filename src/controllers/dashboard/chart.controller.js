const { Venta, Usuario, DetalleVenta, Producto, sequelize } = require('../../database/models');

// 1. Total de ventas realizadas por cada usuario vendedor
const obtenerVentasPorUsuario = async (req, res) => {
  try {
    const resultados = await Venta.findAll({
      attributes: [
        'usuarioId',
        [sequelize.fn('COUNT', sequelize.col('Venta.id')), 'totalVentas']
      ],
      include: {
        model: Usuario,
        attributes: ['nombre']
      },
      group: ['usuarioId', 'Usuario.id'],
      order: [[sequelize.fn('COUNT', sequelize.col('Venta.id')), 'DESC']]
    });

    res.json(resultados);
  } catch (error) {
    console.error('Error al obtener ventas por usuario:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// 2. Productos más vendidos
const obtenerProductosMasVendidos = async (req, res) => {
  try {
    const resultados = await DetalleVenta.findAll({
      attributes: [
        'productoId',
        [sequelize.fn('SUM', sequelize.col('cantidad')), 'cantidadTotal']
      ],
      include: {
        model: Producto,
        attributes: ['nombre']
      },
      group: ['productoId', 'Producto.id'],
      order: [[sequelize.fn('SUM', sequelize.col('cantidad')), 'DESC']]
    });

    res.json(resultados);
  } catch (error) {
    console.error('Error al obtener productos más vendidos:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// 3. Total de dinero generado por cada usuario
const obtenerTotalPorUsuario = async (req, res) => {
  try {
    const resultados = await Venta.findAll({
      attributes: [
        'usuarioId',
        [sequelize.fn('SUM', sequelize.col('total')), 'totalGenerado']
      ],
      include: {
        model: Usuario,
        attributes: ['nombre']
      },
      group: ['usuarioId', 'Usuario.id'],
      order: [[sequelize.fn('SUM', sequelize.col('total')), 'DESC']]
    });

    res.json(resultados);
  } catch (error) {
    console.error('Error al obtener total generado por usuario:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

module.exports = {
  obtenerVentasPorUsuario,
  obtenerProductosMasVendidos,
  obtenerTotalPorUsuario
};
