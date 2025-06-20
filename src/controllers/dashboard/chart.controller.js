const { ActaHistorico , sequelize } = require('../../database/models');
const { Op } = require('sequelize');

const obtenerActasPorUsuarioConFechas = async (req, res) => {
  try {
    const { fecha_desde, fecha_hasta } = req.query;

    const where = {};
    if (fecha_desde && fecha_hasta) {
      const desde = new Date(`${fecha_desde}T00:00:00`);
      const hasta = new Date(`${fecha_hasta}T23:59:59`);

      console.log('Filtrando entre:', desde.toISOString(), 'y', hasta.toISOString());

      where.fecha_registro = {
        [Op.between]: [desde, hasta]
      };
    }


    const resultados = await ActaHistorico.findAll({
      attributes: ['vendedor_nombre',
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalActas']
      ],
      where,
      group: ['vendedor_nombre'],
      order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']]
    });

    const datos = resultados.map(r => {
      const row = r.get({ plain: true });
      return {
        vendedor: row.vendedor_nombre,
        total: parseInt(row.totalActas)
      };
    });

    res.json({ ok: true, datos });

  } catch (error) {
    console.error('Error al obtener actas historicas filtradas:', error);
    res.status(500).json({ ok: false, error: 'Error interno del servidor' });
  }
};

const obtenerEquiposEntregadosPorMes = async (req, res) => {
  try {
    const { fecha_desde, fecha_hasta } = req.query;

    const where = {};
    if (fecha_desde && fecha_hasta) {
      const desde = new Date(`${fecha_desde}T00:00:00`);
      const hasta = new Date(`${fecha_hasta}T23:59:59`);
      where.fecha_registro = {
        [Op.between]: [desde, hasta]
      };
    }

    const resultados = await ActaHistorico.findAll({
      where,
      attributes: [
        [sequelize.literal(`DATE_TRUNC('month', fecha_registro AT TIME ZONE 'UTC' AT TIME ZONE 'America/Guayaquil')`), 'mes'],
        [sequelize.literal(`CONCAT("equipo_marca", ' ', "equipo_modelo")`), 'equipo'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'cantidad']
      ],
      group: ['mes', 'equipo'],
      order: [['mes', 'ASC'], ['equipo', 'ASC']]
    });

    const datos = resultados.map(r => {
      const row = r.get({ plain: true });
      return {
        mes: row.mes,
        equipo: row.equipo,
        cantidad: parseInt(row.cantidad)
      };
    });

    res.json({ ok: true, datos });

  } catch (error) {
    console.error('Error al obtener equipos por mes:', error);
    res.status(500).json({ ok: false, error: 'Error interno del servidor' });
  }
};

const obtenerTotalGeneradoPorMes = async (req, res) => {
  try {
    const { fecha_desde, fecha_hasta } = req.query;

    const where = {};
    if (fecha_desde && fecha_hasta) {
      const desde = new Date(`${fecha_desde}T00:00:00`);
      const hasta = new Date(`${fecha_hasta}T23:59:59`);
      where.fecha_registro = {
        [Op.between]: [desde, hasta]
      };
    }

    const resultados = await ActaHistorico.findAll({
      where,
      attributes: [
        [sequelize.literal(`DATE_TRUNC('month', fecha_registro AT TIME ZONE 'UTC' AT TIME ZONE 'America/Guayaquil')`), 'mes'],
        [sequelize.fn('SUM', sequelize.col('precio')), 'total']
      ],
      group: ['mes'],
      order: [[sequelize.literal('mes'), 'ASC']]
    });

    const datos = resultados.map(r => {
      const row = r.get({ plain: true });
      return {
        mes: row.mes,
        total: parseFloat(row.total)
      };
    });

    res.json({ ok: true, datos });

  } catch (error) {
    console.error('Error al obtener total generado por mes:', error);
    res.status(500).json({ ok: false, error: 'Error interno del servidor' });
  }
};

module.exports = {
  obtenerActasPorUsuarioConFechas,
  obtenerEquiposEntregadosPorMes,
  obtenerTotalGeneradoPorMes
}