const {
  Cliente,
  Equipo,
  InspeccionHardware,
  InspeccionSoftware,
  Adicional,
  Acta,
  ActaHistorico,
  Usuario } = require('../../database/models');

const { generarPDFDesdeFormulario } = require('./pdf.controller')
// funcion encargada de obtener los datos de la peticion http y enviar las respectivas respuestas
// defino que la funcion crearActaCompleta pueda contener operaciones asincronas
const crearActaCompleta = async (req, res) => {

  const t = await Cliente.sequelize.transaction();

  try {
    // defininos los datos que llegan en la peticion desde el front
    const {
      cliente,
      equipo,
      equipo_detalle,
      inspeccion_hw,
      inspeccion_sw,
      adicionales,
      acta,
      observaciones
    } = req.body;

    // bloque encargado de validar si ya existe un cliente o de crearlo en que caso de que no exista
    let clienteExistente = await Cliente.findOne(
      {
        where:
        {
          cedula_ruc: cliente.cedula_ruc
        },
        transaction: t
      }
    );

    if (!clienteExistente) {

      clienteExistente = await Cliente.create(
        {
          nombre: cliente.nombre,
          cedula_ruc: cliente.cedula_ruc,
          telefono: cliente.telefono,
          correo: cliente.correo,
          direccion: cliente.direccion
        },
        {
          transaction: t
        }
      );
    }

    // Buscar y validar el equipo específico
    const equipoExistente = await Equipo.findOne({
      where: {
        id: equipo,
        marca: equipo_detalle.marca,
        modelo: equipo_detalle.modelo,
        numero_serie: equipo_detalle.numero_serie,
        procesador: equipo_detalle.procesador,
        tamano: equipo_detalle.tamano,
        disco: equipo_detalle.disco,
        memoria_ram: equipo_detalle.memoria_ram
      },
      transaction: t
    });

    if (!equipoExistente) {
      throw new Error('El equipo no existe o los detalles no coinciden');
    }

    if (equipoExistente.stock === 'vendido') {
      throw new Error('Este equipo ya ha sido vendido y no puede ser registrado nuevamente.');
    }

    // Marcar como vendido
    await equipoExistente.update({ stock: 'vendido' }, { transaction: t });

    // Verificar stock restante con las mismas características
    const stockDisponible = await Equipo.count({
      where: {
        marca: equipo_detalle.marca,
        modelo: equipo_detalle.modelo,
        procesador: equipo_detalle.procesador,
        tamano: equipo_detalle.tamano,
        disco: equipo_detalle.disco,
        memoria_ram: equipo_detalle.memoria_ram,
        stock: 'disponible'
      },
      transaction: t
    });

    let advertenciaStock = null;
    if (stockDisponible <= 5) {
      advertenciaStock = `¡Atención! Solo quedan ${stockDisponible} equipos ${equipo_detalle.marca} ${equipo_detalle.modelo} en inventario.`;
    }

    // bloque encargado de agregar el usuario operador a la transaccion
    const usuario = await Usuario.findByPk(acta.usuario_id, { transaction: t });

    if (!usuario) {
      throw new Error('El usuario (vendedor) no existe');
    }

    // bloque encargado de crear la acta con los datos necesarios
    const nuevaActa = await Acta.create({
      forma_pago: acta.forma_pago,
      precio: acta.precio,
      usuario_id: acta.usuario_id,
      equipo_id: equipoExistente.id,
      cliente_id: clienteExistente.id,
      vendedor_nombre: usuario.nombre,
      observaciones: typeof observaciones === 'string' && observaciones.trim() !== '' ? observaciones.trim() : null
    }, { transaction: t });

    const actaId = nuevaActa.id;

    await InspeccionHardware.create({
      acta_id: actaId,
      teclado_estado: inspeccion_hw.teclado_estado,
      teclado_observacion: inspeccion_hw.teclado_observacion,
      mouse_estado: inspeccion_hw.mouse_estado,
      mouse_observacion: inspeccion_hw.mouse_observacion,
      camara_estado: inspeccion_hw.camara_estado,
      camara_observacion: inspeccion_hw.camara_observacion,
      pantalla_estado: inspeccion_hw.pantalla_estado,
      pantalla_observacion: inspeccion_hw.pantalla_observacion,
      parlantes_estado: inspeccion_hw.parlantes_estado,
      parlantes_observacion: inspeccion_hw.parlantes_observacion,
      bateria_estado: inspeccion_hw.bateria_estado,
      bateria_observacion: inspeccion_hw.bateria_observacion,
      carcasa_estado: inspeccion_hw.carcasa_estado,
      carcasa_observacion: inspeccion_hw.carcasa_observacion,
      cargador_estado: inspeccion_hw.cargador_estado,
      cargador_observacion: inspeccion_hw.cargador_observacion
    }, { transaction: t });

    await InspeccionSoftware.create({
      acta_id: actaId,
      sistema_operativo: inspeccion_sw.sistema_operativo,
      antivirus: inspeccion_sw.antivirus,
      office: inspeccion_sw.office,
      navegadores: inspeccion_sw.navegadores,
      compresores: inspeccion_sw.compresores,
      acceso_remoto: inspeccion_sw.acceso_remoto,
      nota: typeof inspeccion_sw.nota === 'string' && inspeccion_sw.nota.trim() !== '' ? inspeccion_sw.nota.trim() : null
    }, { transaction: t });

    await Adicional.create({
      acta_id: actaId,
      mouse_estado: adicionales.mouse_estado,
      mouse_observacion: adicionales.mouse_observacion,
      mochila_estado: adicionales.mochila_estado,
      mochila_observacion: adicionales.mochila_observacion,
      estuche_estado: adicionales.estuche_estado,
      estuche_observacion: adicionales.estuche_observacion,
      software1_estado: adicionales.software1_estado,
      software1_observacion: adicionales.software1_observacion,
      software2_estado: adicionales.software2_estado,
      software2_observacion: adicionales.software2_observacion,
      software3_estado: adicionales.software3_estado,
      software3_observacion: adicionales.software3_observacion
    }, { transaction: t });

    // bloque encargado de guardar un historico de las actasHistorico
    await ActaHistorico.create({
      // Cliente
      cliente_nombre: clienteExistente.nombre,
      cliente_cedula: clienteExistente.cedula_ruc,
      cliente_telefono: clienteExistente.telefono,
      cliente_direccion: clienteExistente.direccion,

      // Equipo
      equipo_marca: equipoExistente.marca,
      equipo_modelo: equipoExistente.modelo,
      equipo_numero_serie: equipoExistente.numero_serie,
      equipo_procesador: equipoExistente.procesador,
      equipo_tamano: equipoExistente.tamano,
      equipo_disco: equipoExistente.disco,
      equipo_memoria_ram: equipoExistente.memoria_ram,
      equipo_tipo: equipoExistente.tipo_equipo,
      equipo_estado: equipoExistente.estado,
      equipo_extras: equipoExistente.extras,

      // Inspección hardware
      inspeccion_hw,

      // Inspección software
      inspeccion_sw,

      // Adicionales
      adicionales,

      // Otros
      observaciones,
      forma_pago: acta.forma_pago,
      precio: acta.precio,
      vendedor_nombre: usuario.nombre,
      fecha_registro: new Date()
    }, { transaction: t });

    await t.commit();

    res.status(201).json({
      mensaje: 'Acta registrada con éxito',
      acta_id: nuevaActa.id,
      advertenciaStock: advertenciaStock
    });

  } catch (error) {

    await t.rollback();
    console.error('❌ Error al crear acta:', error);
    res.status(500).json({ error: error.message || 'Error interno al registrar el acta' });

  }
};


const getPDFActaPorId = async (req, res) => {
  try {
    const actaId = req.params.id;

    const acta = await Acta.findByPk(actaId, {
      include: [
        { model: Cliente },
        { model: Equipo },
        { model: Usuario },
        { model: InspeccionHardware },
        { model: InspeccionSoftware },
        { model: Adicional }
      ]
    });

    if (!acta) {
      return res.status(404).json({ error: 'Acta no encontrada' });
    }

    const datos = {
      cliente: {
        nombre: acta.Cliente.nombre,
        cedula_ruc: acta.Cliente.cedula_ruc,
        telefono: acta.Cliente.telefono,
        correo: acta.Cliente.correo,
        direccion: acta.Cliente.direccion
      },
      equipo_detalle: {
        codigo_prd: acta.Equipo.codigo_prd,
        marca: acta.Equipo.marca,
        modelo: acta.Equipo.modelo,
        numero_serie: acta.Equipo.numero_serie,
        procesador: acta.Equipo.procesador,
        tamano: acta.Equipo.tamano,
        disco: acta.Equipo.disco,
        memoria_ram: acta.Equipo.memoria_ram,
        tipo_equipo: acta.Equipo.tipo_equipo,
        estado: acta.Equipo.estado,
        extras: acta.Equipo.extras
      },
      inspeccion_hw: acta.InspeccionHardware ? {
        teclado_estado: acta.InspeccionHardware.teclado_estado,
        teclado_observacion: acta.InspeccionHardware.teclado_observacion,
        mouse_estado: acta.InspeccionHardware.mouse_estado,
        mouse_observacion: acta.InspeccionHardware.mouse_observacion,
        camara_estado: acta.InspeccionHardware.camara_estado,
        camara_observacion: acta.InspeccionHardware.camara_observacion,
        pantalla_estado: acta.InspeccionHardware.pantalla_estado,
        pantalla_observacion: acta.InspeccionHardware.pantalla_observacion,
        parlantes_estado: acta.InspeccionHardware.parlantes_estado,
        parlantes_observacion: acta.InspeccionHardware.parlantes_observacion,
        bateria_estado: acta.InspeccionHardware.bateria_estado,
        bateria_observacion: acta.InspeccionHardware.bateria_observacion,
        carcasa_estado: acta.InspeccionHardware.carcasa_estado,
        carcasa_observacion: acta.InspeccionHardware.carcasa_observacion,
        cargador_estado: acta.InspeccionHardware.cargador_estado,
        cargador_observacion: acta.InspeccionHardware.cargador_observacion
      } : {},
      inspeccion_sw: acta.InspeccionSoftware ? {
        sistema_operativo: acta.InspeccionSoftware.sistema_operativo,
        antivirus: acta.InspeccionSoftware.antivirus,
        office: acta.InspeccionSoftware.office,
        navegadores: acta.InspeccionSoftware.navegadores,
        compresores: acta.InspeccionSoftware.compresores,
        acceso_remoto: acta.InspeccionSoftware.acceso_remoto,
        nota: acta.InspeccionSoftware.nota
      } : {},
      adicionales: acta.Adicional ? {
        mouse_estado: acta.Adicional.mouse_estado,
        mouse_observacion: acta.Adicional.mouse_observacion,
        mochila_estado: acta.Adicional.mochila_estado,
        mochila_observacion: acta.Adicional.mochila_observacion,
        estuche_estado: acta.Adicional.estuche_estado,
        estuche_observacion: acta.Adicional.estuche_observacion,
        software1_estado: acta.Adicional.software1_estado,
        software1_observacion: acta.Adicional.software1_observacion,
        software2_estado: acta.Adicional.software2_estado,
        software2_observacion: acta.Adicional.software2_observacion,
        software3_estado: acta.Adicional.software3_estado,
        software3_observacion: acta.Adicional.software3_observacion
      } : {},
      acta: {
        id: acta.id,
        usuario_id: acta.usuario_id,
        cliente_id: acta.cliente_id,
        equipo_id: acta.equipo_id,
        vendedor_nombre: acta.vendedor_nombre,
        forma_pago: acta.forma_pago,
        precio: acta.precio,
        fecha_registro: acta.fecha_registro,
        createdAt: acta.createdAt
      },
      observaciones: acta.observaciones
    };
    console.log('📦 Datos completos que se enviarán al generador de PDF:', datos);
    const pdfBytes = await generarPDFDesdeFormulario(datos);

    let nombreArchivo = `${acta.Cliente.nombre}_${acta.Cliente.cedula_ruc}_${acta.Equipo.codigo_prd}`;

    // Reemplaza espacios por guiones bajos y quita caracteres no válidos
    nombreArchivo = nombreArchivo.replace(/\s+/g, '_').replace(/[^\w\-\.]/g, '');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=acta_${nombreArchivo}.pdf`);
    res.send(pdfBytes);

  } catch (error) {
    console.error('❌ Error al generar el PDF:', error);
    res.status(500).json({ error: 'Error al generar el PDF del acta' });
  }
};

module.exports = {
  crearActaCompleta,
  getPDFActaPorId
}