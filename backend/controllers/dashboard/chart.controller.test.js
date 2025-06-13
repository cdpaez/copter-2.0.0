const { Acta } = require('../../models');
const { Op, fn, col, literal } = require('sequelize');

exports.ventasPorMes = async (req, res) => {
  try {
    const resultados = await Acta.findAll({
      attributes: [
        [fn('DATE_TRUNC', 'month', col('createdAt')), 'mes'],
        [fn('SUM', col('precio')), 'total']
      ],
      group: [literal('mes')],
      order: [[literal('mes'), 'ASC']]
    });

    // Formatear para el frontend
    const datos = resultados.map(r => ({
      mes: r.get('mes'),
      total: parseFloat(r.get('total'))
    }));

    res.json({ ok: true, datos });
  } catch (error) {
    console.error('❌ Error al obtener ventas por mes:', error);
    res.status(500).json({ ok: false, error: 'Error interno al generar estadísticas.' });
  }
};
