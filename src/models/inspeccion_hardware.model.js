module.exports = (sequelize, DataTypes) => {
  const InspeccionHardware = sequelize.define('InspeccionHardware', {
    acta_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    teclado_estado: DataTypes.BOOLEAN,
    teclado_observacion: DataTypes.STRING,

    mouse_estado: DataTypes.BOOLEAN,
    mouse_observacion: DataTypes.STRING,

    camara_estado: DataTypes.BOOLEAN,
    camara_observacion: DataTypes.STRING,

    pantalla_estado: DataTypes.BOOLEAN,
    pantalla_observacion: DataTypes.STRING,

    parlantes_estado: DataTypes.BOOLEAN,
    parlantes_observacion: DataTypes.STRING,

    bateria_estado: DataTypes.BOOLEAN,
    bateria_observacion: DataTypes.STRING,

    carcasa_estado: DataTypes.BOOLEAN,
    carcasa_observacion: DataTypes.STRING,

    cargador_estado: DataTypes.BOOLEAN,
    cargador_observacion: DataTypes.STRING
  }, {
    tableName: 'inspeccion_hardware',
    timestamps: false
  });

  return InspeccionHardware;
};
