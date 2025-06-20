const { Acta, Usuario, Equipo, sequelize } = require('../../database/models');
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


    const resultados = await Acta.findAll({
      attributes: ['usuario_id',
        [sequelize.fn('COUNT', sequelize.col('Acta.id')), 'totalActas']
      ],
      include: {
        model: Usuario,
        attributes: ['nombre'],
        paranoid: false
      },
      where,
      group: ['usuario_id', 'Usuario.id'],
      order: [[sequelize.fn('COUNT', sequelize.col('Acta.id')), 'DESC']]
    });

    const datos = resultados.map(r => {
      const row = r.get({ plain: true });
      return {
        usuario: row.Usuario.nombre,
        total: parseInt(row.totalActas)
      };
    });

    res.json({ ok: true, datos });

  } catch (error) {
    console.error('Error al obtener actas filtradas:', error);
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

    const resultados = await Acta.findAll({
      where,
      include: {
        model: Equipo,
        paranoid: false,
        attributes: []
      },
      attributes: [
        [sequelize.literal(`DATE_TRUNC('month', fecha_registro AT TIME ZONE 'UTC' AT TIME ZONE 'America/Guayaquil')`), 'mes'],
        [sequelize.literal(`CONCAT("Equipo"."marca", ' ', "Equipo"."modelo")`), 'equipo'],
        [sequelize.fn('COUNT', sequelize.col('Equipo.id')), 'cantidad']
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

    const resultados = await Acta.findAll({
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
};