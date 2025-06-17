const { Acta, Usuario, Cliente, Equipo, InspeccionHardware, InspeccionSoftware, Adicional } = require('../../database/models');

const obtenerActasResumen = async (req, res) => {
  try {
    const actas = await Acta.findAll({
      attributes: ['id', 'fecha_registro', 'forma_pago', 'precio'],
      include: [
        {
          model: Usuario,
          attributes: ['nombre']
        },
        {
          model: Cliente,
          attributes: ['nombre']
        },
        {
          model: Equipo,
          attributes: ['marca', 'modelo', 'numero_serie']
        }
      ],
      order: [['fecha_registro', 'DESC']]
    });

    res.json(actas);
  } catch (error) {
    console.error('Error al obtener actas:', error);
    res.status(500).json({ error: 'Error al obtener el resumen de actas' });
  }
};

const obtenerActaPorId = async (req, res) => {
  try {
    const acta = await Acta.findByPk(req.params.id, {
      include: [
        {
          model: Usuario,
          attributes: ['nombre']
        },
        {
          model: Cliente,
          attributes: ['nombre', 'cedula_ruc']
        },
        {
          model: Equipo,
          attributes: ['marca', 'modelo', 'numero_serie']
        },
        {
          model: InspeccionHardware
        },
        {
          model: InspeccionSoftware
        },
        {
          model: Adicional
        }
      ]
    });

    if (!acta) {
      return res.status(404).json({ error: 'Acta no encontrada' });
    }
    console.log("datos antes del JSON", JSON.stringify(acta, null, 2));
    res.json(acta);

  } catch (error) {
    console.error('Error al obtener acta por ID:', error);
    res.status(500).json({ error: 'Error al obtener el acta' });
  }
};

module.exports = {
  obtenerActaPorId,
  obtenerActasResumen
}
