module.exports = (sequelize, DataTypes) => {
  const Adicional = sequelize.define('Adicional', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    acta_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    mouse_estado: DataTypes.BOOLEAN,
    mouse_observacion: DataTypes.STRING,

    mochila_estado: DataTypes.BOOLEAN,
    mochila_observacion: DataTypes.STRING,

    estuche_estado: DataTypes.BOOLEAN,
    estuche_observacion: DataTypes.STRING,

    software1_estado: DataTypes.BOOLEAN,
    software1_observacion: DataTypes.STRING,

    software2_estado: DataTypes.BOOLEAN,
    software2_observacion: DataTypes.STRING,

    software3_estado: DataTypes.BOOLEAN,
    software3_observacion: DataTypes.STRING
  }, {
    tableName: 'adicionales',
    timestamps: false
  });

  return Adicional;
};
