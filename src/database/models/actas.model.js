module.exports = (sequelize, DataTypes) => {
  const Acta = sequelize.define('Acta', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    cliente_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    equipo_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    vendedor_nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    observaciones: DataTypes.TEXT,
    forma_pago: DataTypes.STRING,
    precio: DataTypes.DECIMAL(10, 2),
    fecha_registro: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'actas',
    createdAt: true,
    updatedAt: false
  });

  return Acta;
};
