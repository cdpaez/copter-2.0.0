module.exports = (sequelize, DataTypes) => {
  const Equipo = sequelize.define('Equipo', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    codigo_prd: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    marca: DataTypes.STRING,
    modelo: DataTypes.STRING,
    numero_serie: {
      type: DataTypes.STRING,
      unique: true
    },
    procesador: DataTypes.STRING,
    tamano: DataTypes.STRING,
    disco: DataTypes.STRING,
    memoria_ram: DataTypes.STRING,
    tipo_equipo: DataTypes.STRING,
    estado: DataTypes.STRING,
    extras: DataTypes.STRING,
    stock: {
      type: DataTypes.ENUM('vendido', 'disponible'),
      defaultValue: 'disponible',
      allowNull: false
    },
    precio: DataTypes.DOUBLE,
    // Campo de fecha automática
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    paranoid: true,
    tableName: 'equipos',
    timestamps: false
  });

  return Equipo;
};


