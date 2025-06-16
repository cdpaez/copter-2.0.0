const sequelize = require('../config/database');
const { Sequelize, DataTypes } = require('sequelize');

// -------------------- IMPORTAR MODELOS --------------------

const Usuario = require('./usuarios.model')(sequelize, DataTypes);
const Cliente = require('./clientes.model')(sequelize, DataTypes);
const Equipo = require('./equipos.model')(sequelize, DataTypes);
const InspeccionHardware = require('./inspeccion_hardware.model')(sequelize, DataTypes);
const InspeccionSoftware = require('./inspeccion_software.model')(sequelize, DataTypes);
const Adicional = require('./adicionales.model')(sequelize, DataTypes);
const Acta = require('./actas.model')(sequelize, DataTypes);

// -------------------- DEFINIR ASOCIACIONES --------------------

// Cliente → Actas
Cliente.hasMany(Acta, { foreignKey: 'cliente_id' });
Acta.belongsTo(Cliente, { foreignKey: 'cliente_id' });

// Usuario → Actas
Usuario.hasMany(Acta, { foreignKey: 'usuario_id' });
Acta.belongsTo(Usuario, { foreignKey: 'usuario_id' });

// Equipo → Actas
Equipo.hasMany(Acta, { foreignKey: 'equipo_id' });
Acta.belongsTo(Equipo, { foreignKey: 'equipo_id' });

// Acta → Inspecciones
Acta.hasOne(InspeccionHardware, { foreignKey: 'acta_id' });
InspeccionHardware.belongsTo(Acta, { foreignKey: 'acta_id' });

Acta.hasOne(InspeccionSoftware, { foreignKey: 'acta_id' });
InspeccionSoftware.belongsTo(Acta, { foreignKey: 'acta_id' });

Acta.hasOne(Adicional, { foreignKey: 'acta_id' });
Adicional.belongsTo(Acta, { foreignKey: 'acta_id' });

// -------------------- EXPORTAR MODELOS --------------------

module.exports = {
  sequelize,
  Sequelize,
  Usuario,
  Cliente,
  Equipo,
  InspeccionHardware,
  InspeccionSoftware,
  Adicional,
  Acta
};
