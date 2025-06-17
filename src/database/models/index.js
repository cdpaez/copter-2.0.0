'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

// Configurar la conexión
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Cargar modelos automáticamente
fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Definir asociaciones manualmente (mejor que en los archivos de modelos)
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Asociaciones específicas
db.Cliente.hasMany(db.Acta, { foreignKey: 'cliente_id' });
db.Acta.belongsTo(db.Cliente, { foreignKey: 'cliente_id' });

db.Usuario.hasMany(db.Acta, { foreignKey: 'usuario_id' });
db.Acta.belongsTo(db.Usuario, { foreignKey: 'usuario_id' });

db.Equipo.hasMany(db.Acta, { foreignKey: 'equipo_id' });
db.Acta.belongsTo(db.Equipo, { foreignKey: 'equipo_id' });

db.Acta.hasOne(db.InspeccionHardware, { foreignKey: 'acta_id' });
db.InspeccionHardware.belongsTo(db.Acta, { foreignKey: 'acta_id' });

db.Acta.hasOne(db.InspeccionSoftware, { foreignKey: 'acta_id' });
db.InspeccionSoftware.belongsTo(db.Acta, { foreignKey: 'acta_id' });

db.Acta.hasOne(db.Adicional, { foreignKey: 'acta_id' });
db.Adicional.belongsTo(db.Acta, { foreignKey: 'acta_id' });

// Exportar
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;