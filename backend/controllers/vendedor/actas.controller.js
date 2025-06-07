const {
  Cliente,
  Equipo,
  InspeccionHardware,
  InspeccionSoftware,
  Adicional,
  Acta,
  Usuario
} = require('../../models');

exports.crearActaCompleta = async (req, res) => {
  console.log('datos para guardar en el acta:', req.body);

  const t = await Cliente.sequelize.transaction();

  try {
    const {
      cliente,
      equipo,
      inspeccion_hw,
      inspeccion_sw,
      adicionales,
      acta
    } = req.body;

    if (!equipo || isNaN(equipo)) {
      throw new Error('ID de equipo inválido o no proporcionado');
    }

    let clienteExistente = await Cliente.findOne({
      where: { cedula_ruc: cliente.cedula_ruc },
      transaction: t
    });

    if (!clienteExistente) {
      clienteExistente = await Cliente.create(cliente, { transaction: t });
    }

    const equipoExistente = await Equipo.findByPk(equipo, { transaction: t });

    if (!equipoExistente) {
      throw new Error('El equipo seleccionado no existe');
    }

    // 👉 PRIMERO creamos el Acta
    const nuevaActa = await Acta.create(
      {
        ...acta,
        equipo_id: equipoExistente.id,
        cliente_id: clienteExistente.id,
        usuario_id: acta.usuario_id,
        observaciones: req.body.observaciones?.trim() || null
      },
      { transaction: t }
    );

    const actaId = nuevaActa.id;

    // 👉 Luego creamos las inspecciones y adicionales usando acta_id
    await InspeccionHardware.create({
      acta_id: actaId,

      teclado_estado: inspeccion_hw.teclado,
      teclado_observacion: inspeccion_hw.teclado_obs?.trim() || null,

      mouse_estado: inspeccion_hw.mouse,
      mouse_observacion: inspeccion_hw.mouse_obs?.trim() || null,

      camara_estado: inspeccion_hw.camara,
      camara_observacion: inspeccion_hw.camara_obs?.trim() || null,

      pantalla_estado: inspeccion_hw.pantalla,
      pantalla_observacion: inspeccion_hw.pantalla_obs?.trim() || null,

      parlantes_estado: inspeccion_hw.parlantes,
      parlantes_observacion: inspeccion_hw.parlantes_obs?.trim() || null,

      bateria_estado: inspeccion_hw.bateria,
      bateria_observacion: inspeccion_hw.bateria_obs?.trim() || null,

      carcasa_estado: inspeccion_hw.carcasa,
      carcasa_observacion: inspeccion_hw.carcasa_obs?.trim() || null,

      cargador_estado: inspeccion_hw.cargador,
      cargador_observacion: inspeccion_hw.cargador_obs?.trim() || null
    }, { transaction: t });

    await InspeccionSoftware.create(
      {
        acta_id: actaId,
        nota: inspeccion_sw.nota?.trim() === '' ? null : inspeccion_sw.nota,
        sistema_operativo: inspeccion_sw.sistema_operativo,
        antivirus: inspeccion_sw.antivirus,
        office: inspeccion_sw.office,
        navegadores: inspeccion_sw.navegadores,
        compresores: inspeccion_sw.compresores,
        acceso_remoto: inspeccion_sw.acceso_remoto
      },
      { transaction: t }
    );

    await Adicional.create(
      {
        acta_id: actaId,

        mouse_estado: adicionales.mouse,
        mouse_observacion: adicionales.mouse_obs?.trim() || null,

        mochila_estado: adicionales.mochila,
        mochila_observacion: adicionales.mochila_obs?.trim() || null,

        estuche_estado: adicionales.estuche,
        estuche_observacion: adicionales.estuche_obs?.trim() || null,

        software1_estado: adicionales.software1,
        software1_observacion: adicionales.software1_obs?.trim() || null,

        software2_estado: adicionales.software2,
        software2_observacion: adicionales.software2_obs?.trim() || null,

        software3_estado: adicionales.software3,
        software3_observacion: adicionales.software3_obs?.trim() || null
      },
      { transaction: t }
    );

    await t.commit();
    res.status(201).json({
      mensaje: 'Acta registrada con éxito',
      acta: nuevaActa
    });

  } catch (error) {
    await t.rollback();
    console.error('❌ Error al crear acta:', error);
    res.status(500).json({ error: error.message || 'Error interno al registrar el acta' });
  }
};