module.exports = (sequelize, DataTypes) => {
  const ActaHistorico = sequelize.define('ActaHistorico', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    // Cliente
    cliente_nombre: DataTypes.STRING,
    cliente_cedula: DataTypes.STRING,
    cliente_telefono: DataTypes.STRING,
    cliente_direccion: DataTypes.STRING,

    // Equipo
    // Equipo
    equipo_codigo_prd: {
      type: DataTypes.STRING,
      allowNull: false
    },
    equipo_marca: DataTypes.STRING,
    equipo_modelo: DataTypes.STRING,
    equipo_numero_serie: DataTypes.STRING,
    equipo_procesador: DataTypes.STRING,
    equipo_tamano: DataTypes.STRING,
    equipo_disco: DataTypes.STRING,
    equipo_memoria_ram: DataTypes.STRING,
    equipo_tipo: DataTypes.STRING,
    equipo_estado: DataTypes.STRING,
    equipo_extras: DataTypes.TEXT,

    // Inspección Hardware
    inspeccion_hw: DataTypes.JSON, // opcional: puedes usar JSON para guardar el bloque entero

    // Inspección Software
    inspeccion_sw: DataTypes.JSON,

    // Adicionales
    adicionales: DataTypes.JSON,

    // Observaciones y otros
    observaciones: DataTypes.TEXT,
    forma_pago: DataTypes.STRING,
    precio: DataTypes.DECIMAL(10, 2),

    vendedor_nombre: DataTypes.STRING,

    fecha_registro: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }

  }, {
    tableName: 'actas_historicos',
    createdAt: true,
    updatedAt: false
  });

  return ActaHistorico;
};
