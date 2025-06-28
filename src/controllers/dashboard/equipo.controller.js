// backend/controllers/producto.controller.js
const fs = require('fs');
const csv = require('csv-parser');
const ExcelJS = require('exceljs');
const path = require('path');
const { UniqueConstraintError, ValidationError } = require('sequelize');
const { Equipo } = require('../../database/models');

// Crear un nuevo producto
const anadirEquipos = async (req, res) => {
  try {
    console.log(req.body)
    const nuevoProducto = await Equipo.create(req.body);
    res.status(201).json(
      {
        mensaje: 'Producto creado exitosamente',
        producto: nuevoProducto
      });
  } catch (error) {
    console.error('❌ Error al crear el equipo:', error);
    if (error instanceof UniqueConstraintError) {
      // Extraemos el campo o los campos que causaron el error
      const campos = error.errors.map(e => e.path).join(', ');

      return res.status(400).json({
        mensaje: `Ya existe un producto con el mismo valor en: ${campos}`
      });
    }
    res.status(500).json(
      {
        mensaje: 'Error al crear el producto',
        error: error.message
      });
  }
};

// Obtener todos los productos
const obtenerEquipos = async (req, res) => {
  try {
    const productos = await Equipo.findAll({
      order: [['id', 'DESC']] // opcional, por si quieres los más recientes primero
    });

    res.status(200).json(productos);

  } catch (error) {
    console.error('❌ Error al obtener los equipos:', error);
    res.status(500).json({
      mensaje: 'Error al obtener los equipos',
      error: error.message
    });
  }
};
// Obtener los productos acorde a su ID
// backend/controllers/producto.controller.js
const obtenerEquiposPorId = async (req, res) => {
  try {
    const producto = await Equipo.findByPk(req.params.id); // Usa tu modelo directamente
    console.log('se encontro algo?', producto)
    if (!producto) {
      return res.status(404).json({
        success: false,
        mensaje: 'Producto no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: producto // Devuelve todos los campos del producto
    });

  } catch (error) {
    console.error('cual fue el error?', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener el producto',
      error: error.message
    });
  }
};
// Actualizar un producto
const actualizarEquipos = async (req, res) => {
  try {
    const { id } = req.params;
    const [actualizado] = await Equipo.update(req.body,
      {
        where:
        {
          id
        }
      });

    if (actualizado) {
      res.status(200).json(
        {
          mensaje: 'Producto actualizado correctamente'
        }
      );
    } else {
      res.status(404).json(
        {
          mensaje: 'Producto no encontrado'
        }
      );
    }
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      // Extraemos el campo o los campos que causaron el error
      const campos = error.errors.map(e => e.path).join(', ');

      return res.status(400).json({
        mensaje: `Ya existe un producto con el mismo valor en: ${campos}`
      });
    }
    res.status(500).json(
      {
        mensaje: 'Error al actualizar el producto', error: error.message
      }
    );
  }
};


// Eliminar un producto
const eliminarEquipos = async (req, res) => {
  console.log('Iniciando proceso de eliminación de equipo');

  try {
    const { id } = req.params;
    console.log(`ID recibido para eliminar: ${id}`);

    console.log('Ejecutando consulta de eliminación en la base de datos...');
    const eliminado = await Equipo.destroy({
      where: { id }
    });

    if (eliminado) {
      console.log(`Equipo con ID ${id} eliminado correctamente`);
      res.status(200).json({
        mensaje: 'Producto eliminado correctamente'
      });
    } else {
      console.log(`No se encontró equipo con ID ${id}`);
      res.status(404).json({
        mensaje: 'Producto no encontrado'
      });
    }
  } catch (error) {
    console.error(`Error al intentar eliminar un equipo: ${error.message}`);
    console.error('Stack trace:', error.stack);
    res.status(500).json({
      mensaje: 'Error al eliminar el producto'
    });
  } finally {
    console.log('Proceso de eliminación finalizado');
  }
};

// TODO: arreglar la funcion encargada de importar datos desde algun excel
const importarEquipos = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No se subió ningún archivo' });

    const productos = [];
    const ext = path.extname(req.file.originalname).toLowerCase();
    const filePath = req.file.path;

    // CSV
    if (ext === '.csv') {
      await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', row => productos.push(row))
          .on('end', resolve)
          .on('error', reject);
      });
    }

    // XLSX / XLS
    else if (ext === '.xlsx' || ext === '.xls') {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(filePath);
      const worksheet = workbook.worksheets[0];

      const headers = [];
      worksheet.getRow(1).eachCell(cell => headers.push(cell.value));

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          const producto = {};
          row.eachCell((cell, colNumber) => {
            producto[headers[colNumber - 1]] = cell.value;
          });
          productos.push(producto);
        }
      });
    }

    // ODS
    else if (ext === '.ods') {
      const workbook = XLSX.readFile(filePath, { type: 'file' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);
      productos.push(...data);
    }

    else {
      throw new Error('Formato no soportado. Usa .csv, .xlsx o .ods');
    }

    // Insertar en base de datos
    const creados = await Equipo.bulkCreate(productos, {
      validate: true,
      ignoreDuplicates: true
    });

    fs.unlinkSync(filePath); // Eliminar archivo temporal

    res.json({
      success: true,
      total: productos.length,
      importados: creados.length,
      duplicados: productos.length - creados.length
    });

  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ success: false, error: error.message });
  }
};
module.exports = {
  anadirEquipos,
  obtenerEquipos,
  obtenerEquiposPorId,
  actualizarEquipos,
  eliminarEquipos,
  importarEquipos
};
