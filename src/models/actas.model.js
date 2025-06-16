module.exports = (sequelize, DataTypes) => {
  const Acta = sequelize.define('Acta', {
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cliente_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    equipo_id: {
      type: DataTypes.INTEGER,
      allowNull: false
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
    },
    path_pdf: DataTypes.STRING
  }, {
    tableName: 'actas',
    createdAt: true,
    updatedAt: false
  });

  return Acta;
};
