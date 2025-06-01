// backend/controllers/producto.controller.js
const fs = require('fs');
const csv = require('csv-parser'); 
const xlsx = require('xlsx'); 

const { Equipo } = require('../../models');

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
    console.log('se encontro algo?',producto)
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
      res.status(200).json({ mensaje: 'Producto actualizado correctamente' });
    } else {
      res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar el producto', error: error.message });
  }
};

// Eliminar un producto
const eliminarEquipos = async (req, res) => {

  try {

    const { id } = req.params;
    const eliminado = await Equipo.destroy(
      { 
        where: { id } 
      });

    if (eliminado) {
      res.status(200).json(
        { 
          mensaje: 'Producto eliminado correctamente' 
        });
    } else {
      res.status(404).json(
        { 
          mensaje: 'Producto no encontrado' 
        });
    }
  } catch (error) {
    res.status(500).json(
      { 
        mensaje: 'Error al eliminar el producto', error: error.message 
      });
  }
};

const importarEquipos = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ningún archivo' });
    }

    const productos = [];
    const filePath = req.file.path;

    // Procesar CSV
    if (req.file.mimetype === 'text/csv' || req.file.originalname.endsWith('.csv')) {
      await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', (row) => productos.push(row))
          .on('end', resolve)
          .on('error', reject);
      });
    } 
    // Procesar Excel
    else if (
      req.file.mimetype.includes('spreadsheet') || 
      req.file.originalname.endsWith('.xlsx')
    ) {
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      productos.push(...xlsx.utils.sheet_to_json(worksheet));
    } else {
      throw new Error('Formato de archivo no soportado');
    }

    // Validar y guardar productos
    const productosCreados = await Equipo.bulkCreate(productos, {
      validate: true, // Valida cada registro
      ignoreDuplicates: true // Ignora registros duplicados
    });

    // Eliminar archivo temporal
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      total: productos.length,
      importados: productosCreados.length,
      duplicados: productos.length - productosCreados.length
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
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
