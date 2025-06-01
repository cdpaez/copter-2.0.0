module.exports = (sequelize, DataTypes) => {
  const InspeccionSoftware = sequelize.define('InspeccionSoftware', {
    equipo_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sistema_operativo: DataTypes.BOOLEAN,
    antivirus: DataTypes.BOOLEAN,
    office: DataTypes.BOOLEAN,
    navegadores: DataTypes.BOOLEAN,
    compresores: DataTypes.BOOLEAN,
    acceso_remoto: DataTypes.BOOLEAN,
    nota: DataTypes.STRING
  }, {
    tableName: 'inspeccion_software',
    timestamps: false
  });

  return InspeccionSoftware;
};
