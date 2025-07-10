const { ActaHistorico } = require('../../database/models');

// Obtener resumen de actas desde actas_historicos
const obtenerActasResumen = async (req, res) => {
  try {
    const actas = await ActaHistorico.findAll({
      attributes: [
        'id',
        'fecha_registro',
        'forma_pago',
        'precio',
        'vendedor_nombre',
        'cliente_nombre',
        'cliente_cedula',
        'equipo_codigo_prd',
        'equipo_marca',
        'equipo_modelo',
        'equipo_numero_serie'
      ],
      order: [['fecha_registro', 'DESC']]
    });

    res.json(actas);
  } catch (error) {
    console.error('❌ Error al obtener actas históricas:', error);
    res.status(500).json({ error: 'Error al obtener el resumen de actas históricas' });
  }
};

// Obtener una acta histórica por ID
const obtenerActaPorId = async (req, res) => {
  try {
    const acta = await ActaHistorico.findByPk(req.params.id);

    if (!acta) {
      return res.status(404).json({ error: 'Acta histórica no encontrada' });
    }

    console.log("📄 Acta histórica cargada:", JSON.stringify(acta, null, 2));
    res.json(acta);
  } catch (error) {
    console.error('❌ Error al obtener acta histórica por ID:', error);
    res.status(500).json({ error: 'Error al obtener el acta histórica' });
  }
};

module.exports = {
  obtenerActasResumen,
  obtenerActaPorId
};
