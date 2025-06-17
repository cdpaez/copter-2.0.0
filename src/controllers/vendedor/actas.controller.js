const {
  Cliente,
  Equipo,
  InspeccionHardware,
  InspeccionSoftware,
  Adicional,
  Acta,
  Usuario
} = require('../../database/models');

const crearActaCompleta = async (req, res) => {
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

    // ✅ Validación de stock antes de continuar
    if (equipoExistente.stock == 0) {
      await t.rollback(); // Revertimos cualquier cambio
      return res.status(400).json({
        error: `No hay stock disponible para el equipo "${equipoExistente.marca} - ${equipoExistente.numero_serie}".`
      });
    }

    // Descontar stock
    equipoExistente.stock -= 1;
    await equipoExistente.save({ transaction: t });

    // Si el stock está bajo, enviamos una advertencia (no se interrumpe)
    let advertenciaStock = null;
    if (equipoExistente.stock <= 5) {
      advertenciaStock = `Solo quedan ${equipoExistente.stock} unidades del equipo ${equipoExistente.marca} - ${equipoExistente.numero_serie}.`;
    }

    // 👇 Buscar el usuario antes de crear el acta
    const usuario = await Usuario.findByPk(acta.usuario_id, { transaction: t });

    if (!usuario) {
      throw new Error('El usuario (vendedor) no existe');
    }

    // 👉 PRIMERO creamos el Acta
    const nuevaActa = await Acta.create(
      {
        ...acta,
        equipo_id: equipoExistente.id,
        cliente_id: clienteExistente.id,
        usuario_id: acta.usuario_id,
        vendedor_nombre: usuario.nombre, // nuevo campo
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

    // await generarPDFDesdeFormulario(req.body, `acta_${cliente.nombre}.pdf`);
    // normalizacion de nombres
    const nombreCliente = cliente.nombre
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // elimina tildes
      .replace(/\s+/g, '_') // reemplaza espacios por guiones bajos
      .replace(/[^a-zA-Z0-9_]/g, ''); // elimina caracteres especiales
      
    // req.body.acta.vendedor_nombre = usuario.nombre;
    // // Generar el PDF y obtener la ruta absoluta
    // const rutaCompletaPDF = await generarPDFDesdeFormulario(req.body, `acta_${nombreCliente}_${nuevaActa.id}.pdf`);
    // // Convertirla a ruta relativa (por ejemplo, eliminar el path absoluto del sistema)
    // const rutaRelativaPDF = `uploads/actas/acta_${nombreCliente}_${nuevaActa.id}.pdf`;
    // // Actualizar el campo ruta_pdf en el acta recién creada
    // await nuevaActa.update({ path_pdf: rutaRelativaPDF }, { transaction: t });

    await t.commit();

    res.status(201).json({
      mensaje: 'Acta registrada con éxito',
      acta: nuevaActa,
      // path_pdf: rutaRelativaPDF,
      advertenciaStock // puede ser null si no aplica
    });

  } catch (error) {
    await t.rollback();
    console.error('❌ Error al crear acta:', error);
    res.status(500).json({ error: error.message || 'Error interno al registrar el acta' });
  }
};

// seccion encargada de la creacion del acta fisica
const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

const generarPDFDesdeFormulario = async (datos, nombreArchivo) => {
  try {
    const basePath = path.resolve('./pdf/acta_base.pdf');
    const pdfBytes = fs.readFileSync(basePath);

    const pdfDoc = await PDFDocument.load(pdfBytes);
    const page = pdfDoc.getPages()[0];
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const fechaHoy = new Date().toLocaleDateString('es-EC', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    // Ejemplo de escritura de campos en posiciones estimadas
    page.drawText(`precio: $${parseFloat(datos.acta.precio).toFixed(2)}`, { x: 400, y: 785, size: 12, font });
    page.drawText(`Vendedor: ${datos.acta.vendedor_nombre || '---'}`, { x: 400, y: 770, size: 12, font });

    // datos del cliente

    // columna izquierda
    page.drawText(`nombre: ${datos.cliente.nombre || ''}`, { x: 35, y: 660, size: 12, font });
    page.drawText(`telefono: ${datos.cliente.telefono || ''}`, { x: 35, y: 645, size: 12, font });
    page.drawText(`correo: ${datos.cliente.correo || ''}`, { x: 35, y: 630, size: 12, font });

    // columnaderecha
    page.drawText(`direccion: ${datos.cliente.direccion || ''}`, { x: 300, y: 660, size: 12, font });
    page.drawText(`cedula: ${datos.cliente.cedula_ruc || ''}`, { x: 300, y: 645, size: 12, font });
    page.drawText(`fecha de compra: ${fechaHoy}`, { x: 300, y: 630, size: 12, font });

    // datos del equipo
    const eq = datos.equipo_detalle || {};
    // columna izquierda
    page.drawText(`marca: ${eq.marca || ''}`, { x: 35, y: 585, size: 12, font });
    page.drawText(`n° de serie: ${eq.numero_serie || ''}`, { x: 35, y: 570, size: 12, font });
    page.drawText(`tamaño: ${eq.tamano || ''}`, { x: 35, y: 555, size: 12, font });
    page.drawText(`memoria RAM: ${eq.memoria_ram || ''}`, { x: 35, y: 540, size: 12, font });
    page.drawText(`estado: ${eq.estado || ''}`, { x: 35, y: 525, size: 12, font });

    // columna derecha
    page.drawText(`modelo: ${eq.modelo || ''}`, { x: 300, y: 585, size: 12, font });
    page.drawText(`procesador: ${eq.procesador || ''}`, { x: 300, y: 570, size: 12, font });
    page.drawText(`disco: ${eq.disco || ''}`, { x: 300, y: 555, size: 12, font });
    page.drawText(`tipo: ${eq.tipo_equipo || ''}`, { x: 300, y: 540, size: 12, font });
    page.drawText(`extras: ${eq.extras || ''}`, { x: 300, y: 525, size: 12, font });

    // inspeccion hardware
    const hw = datos.inspeccion_hw || {};
    const fontSize_hw = 12;
    const startY_hw = 490;
    const lineHeight_hw = 15;

    const col1X_hw = 35;
    const col2X_hw = 300;

    const componentesHW = [
      ['teclado', 'Teclado'],
      ['camara', 'Cámara'],
      ['parlantes', 'Parlantes'],
      ['carcasa', 'Carcasa'],
      ['mouse', 'Mouse'],
      ['pantalla', 'Pantalla'],
      ['bateria', 'Batería'],
      ['cargador', 'Cargador']
    ];

    // Recorremos los componentes y los dividimos por columnas
    for (let i = 0; i < componentesHW.length; i++) {
      const [clave, etiqueta] = componentesHW[i];
      const obs = hw[`${clave}_obs`] || '';
      const estado = hw[clave];

      let texto = '';
      if (obs.trim()) {
        texto = `${etiqueta}: ${obs.trim()}`;
      } else if (estado) {
        texto = `${etiqueta}: [aprobado]`;
      }

      if (texto) {
        const x = i < 4 ? col1X_hw : col2X_hw;
        const y = startY_hw - (i % 4) * lineHeight_hw;

        page.drawText(texto, {
          x,
          y,
          size: fontSize_hw,
          font
        });
      }

      // inspeccion de software
      const sw = datos.inspeccion_sw || {};
      const fontSize_sw = 10;
      const startY_sw = 410;
      const lineHeight_sw = 15;

      const col1X_sw = 35;
      const col2X_sw = 300;

      const camposSW = [
        ['sistema_operativo', 'Sistema Operativo'],
        ['antivirus', 'Antivirus'],
        ['office', 'Office'],
        ['navegadores', 'Navegadores'],
        ['compresores', 'Compresores'],
        ['acceso_remoto', 'Acceso Remoto']
      ];

      for (let i = 0; i < camposSW.length; i++) {
        const [clave, etiqueta] = camposSW[i];
        const estado = sw[clave];

        if (estado) {
          const x = i < 3 ? col1X_sw : col2X_sw;
          const y = startY_sw - (i % 3) * lineHeight_sw;

          page.drawText(`[X] ${etiqueta}`, {
            x,
            y,
            size: fontSize_sw,
            font
          });
        }
      }

      // Agregar nota debajo de la columna izquierda
      if (sw.nota && sw.nota.trim() !== '') {
        const notaY_sw = startY_sw - 3 * lineHeight_sw - 2;

        page.drawText(`Nota: ${sw.nota.trim()}`, {
          x: col1X_sw,
          y: notaY_sw,
          size: fontSize_sw,
          font
        });
      }

      // adicionales
      const ad = datos.adicionales || {};
      const fontSize_ad = 12;
      const startY_ad = 330;
      const lineHeight_ad = 15;

      const col1X_ad = 35;
      const col2X_ad = 300;

      const camposAdicionales_ad = [
        ['mouse', 'Mouse'],
        ['estuche', 'Estuche'],
        ['software2', 'Software 2'],
        ['mochila', 'Mochila'],
        ['software1', 'Software 1'],
        ['software3', 'Software 3']
      ];

      for (let i = 0; i < camposAdicionales_ad.length; i++) {
        const [clave_ad, etiqueta_ad] = camposAdicionales_ad[i];

        const check_ad = ad[`${clave_ad}`]; // true / false
        const obs_ad = ad[`${clave_ad}_obs`] || '';

        const x_ad = i < 3 ? col1X_ad : col2X_ad;
        const y_ad = startY_ad - (i % 3) * lineHeight_ad;

        if (check_ad && obs_ad.trim()) {
          // Caso: check = true y texto válido
          page.drawText(`${etiqueta_ad}: ${obs_ad.trim()}`, {
            x: x_ad,
            y: y_ad,
            size: fontSize_ad,
            font
          });
        } else if (!check_ad) {
          // Caso: check = false → mostrar "No aplica" en gris y cursiva
          page.drawText(`${etiqueta_ad}: No aplica`, {
            x: x_ad,
            y: y_ad,
            size: fontSize_ad,
            font,
            color: rgb(0.5, 0.5, 0.5), // gris medio
            italic: true // aunque pdf-lib no tiene flag directo para cursiva, si luego usas una fuente personalizada sí se puede
          });
        }

        const observaciones = datos.observaciones || '';
        const fontSize_obs = 10;
        const x_obs = 35;
        const y_start = 268; // posición Y inicial
        const lineHeight = 14; // espacio entre líneas
        const maxLineWidth = 90; // Ancho máximo en mm o puntos, depende del PDF

        if (observaciones.trim()) {
          const texto = `Observaciones: ${observaciones.trim()}`;

          // Romper el texto en palabras
          const palabras = texto.split(' ');
          const lineas = [];
          let lineaActual = '';

          for (const palabra of palabras) {
            const testLinea = lineaActual.length ? `${lineaActual} ${palabra}` : palabra;

            // Si se pasa de longitud deseada, guardar la línea y empezar otra
            if (testLinea.length > 100) {  // Ajusta este número según el ancho de tu página y fuente
              lineas.push(lineaActual);
              lineaActual = palabra;
            } else {
              lineaActual = testLinea;
            }
          }
          if (lineaActual) lineas.push(lineaActual); // última línea

          // Dibujar líneas en el PDF
          lineas.forEach((linea, index) => {
            page.drawText(linea, {
              x: x_obs,
              y: y_start - index * lineHeight,
              size: fontSize_obs,
              font
            });
          });
        }
      }

      // formas de pago
      function normalizarTexto(texto) {
        return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      } const formasPago = ['Efectivo', 'Depósito', 'Transferencia', 'Tarjeta'];
      const seleccionada = normalizarTexto(datos.acta.forma_pago || '');

      const fontSize_fp = 10;
      const y_fp = 220;
      const startX_fp = 90;
      const spacing_fp = 120;

      formasPago.forEach((forma, index) => {
        const activa = normalizarTexto(forma) === seleccionada;
        const texto = `${activa ? '[X]' : '[ ]'} ${forma}`;

        page.drawText(texto, {
          x: startX_fp + index * spacing_fp,
          y: y_fp,
          size: fontSize_fp,
          font
        });
      });

      // bancos
      const bancos = [
        {
          nombre: 'Banco Pichincha',
          cuenta: 'Cuenta de Ahorros 1234567890',
          titular: 'Juan Pérez',
          cedula: '0102030405',
          correo: 'juan.perez@pichincha.com',
          x: 35,
        },
        {
          nombre: 'Banco Guayaquil',
          cuenta: 'Cuenta de Ahorros 9876543210',
          titular: 'Ana Gómez',
          cedula: '1122334455',
          correo: 'ana.gomez@guayaquil.fin',
          x: 300,
        }
      ];

      const fontSize_bank = 11;
      const yInicial = 185;
      const deltaY = 13;

      for (const banco of bancos) {
        let y = yInicial;

        // Texto
        page.drawText(banco.nombre, { x: banco.x, y, size: fontSize_bank, font });
        y -= deltaY;
        page.drawText(banco.cuenta, { x: banco.x, y, size: fontSize_bank, font });
        y -= deltaY;
        page.drawText(`Titular: ${banco.titular}`, { x: banco.x, y, size: fontSize_bank, font });
        y -= deltaY;
        page.drawText(`C.I.: ${banco.cedula}`, { x: banco.x, y, size: fontSize_bank, font });
        y -= deltaY;
        page.drawText(`Email: ${banco.correo}`, { x: banco.x, y, size: fontSize_bank, font });
      }


    }

    const outputPath = path.resolve(`./uploads/actas/${nombreArchivo}`);
    const pdfFinal = await pdfDoc.save();
    fs.writeFileSync(outputPath, pdfFinal);

    console.log('PDF generado exitosamente en:', outputPath);
    return outputPath;

  } catch (error) {
    console.error('Error al generar el PDF:', error);
    throw error;
  }
}

module.exports = {
  crearActaCompleta
}