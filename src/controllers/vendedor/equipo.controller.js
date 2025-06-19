const { Op } = require('sequelize');
const { Equipo } = require('../../database/models');

const buscarEquipos = async (req, res) => {

  const { termino } = req.query;
  console.log('Término de búsqueda:', termino);
  
  try {
    const equipos = await Equipo.findAll({
      where: {
        [Op.or]: [
          { marca: { [Op.iLike]: `%${termino}%` } },
          { codigo_prd: { [Op.iLike]: `%${termino}%` } }
        ]
      }
    });
    console.log('Resultados encontrados:', equipos.length);

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