module.exports = (sequelize, DataTypes) => {
  const Equipo = sequelize.define('Equipo', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    marca: DataTypes.STRING,
    modelo: DataTypes.STRING,
    numero_serie: DataTypes.STRING,
    procesador: DataTypes.STRING,
    tamano: DataTypes.STRING,
    disco: DataTypes.STRING,
    memoria_ram: DataTypes.STRING,
    tipo_equipo: DataTypes.STRING,
    estado: DataTypes.STRING,
    extras: DataTypes.STRING,
    stock: DataTypes.INTEGER,
    precio: DataTypes.DOUBLE,
    // Campo de fecha automática
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'equipos',
    timestamps: false
  });

  return Equipo;
};


