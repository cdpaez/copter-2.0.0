const { Op } = require('sequelize');
const { Equipo } = require('../../models');

const buscarEquipos = async (req, res) => {
  const { termino } = req.query;

  try {
    const equipos = await Equipo.findAll({
      where: {
        [Op.or]: [
          { marca: { [Op.iLike]: `%${termino}%` } },
          { numero_serie: { [Op.iLike]: `%${termino}%` } }
        ]
      }
    });

    res.json(equipos);
  } catch (error) {
    res.status(500).json(
      { 
        mensaje: 'Error en la búsqueda', error: error.message 
      });
  }
};
module.exports = {
  buscarEquipos
};