const pool = require('../config/db');
const sendResponse = require('../utils/responseHandler');

// GET: Obtener todos los productos
exports.getAllProductos = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM PRODUCTOS');
    return sendResponse(res, 200, true, 'Lista de productos consultada correctamente', rows);
  } catch (error) {
    return sendResponse(res, 500, false, `Error en el servidor: ${error.message}`);
  }
};

// GET: Obtener producto por ID
exports.getProductoById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM PRODUCTOS WHERE codproducto = ?', [id]);
    
    if (rows.length === 0) {
      return sendResponse(res, 404, false, 'Producto no encontrado');
    }

    return sendResponse(res, 200, true, 'Producto consultado correctamente', rows[0]);
  } catch (error) {
    return sendResponse(res, 500, false, `Error en el servidor: ${error.message}`);
  }
};

// POST: Crear nuevo producto
exports.createProducto = async (req, res) => {
  try {
    const { id_proveedor, id_familia_olfativa, nombre_perfume, marca, mililitros, isbn_upc, descripcion, precio_venta, imagen_url, modelo_3d_sketchfab, video_youtube_id } = req.body;

    if (!id_proveedor || !id_familia_olfativa || !nombre_perfume || !precio_venta) {
      return sendResponse(res, 400, false, 'Los campos id_proveedor, id_familia_olfativa, nombre_perfume y precio_venta son obligatorios');
    }

    const [result] = await pool.query(
      `INSERT INTO PRODUCTOS (id_proveedor, id_familia_olfativa, nombre_perfume, marca, mililitros, isbn_upc, descripcion, precio_venta, imagen_url, modelo_3d_sketchfab, video_youtube_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id_proveedor, id_familia_olfativa, nombre_perfume, marca, mililitros, isbn_upc, descripcion, precio_venta, imagen_url, modelo_3d_sketchfab, video_youtube_id]
    );

    const newProducto = { id: result.insertId, ...req.body };
    return sendResponse(res, 201, true, 'Producto creado correctamente', newProducto);
  } catch (error) {
    return sendResponse(res, 500, false, `Error en el servidor: ${error.message}`);
  }
};

// PUT: Actualizar producto
exports.updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_proveedor, id_familia_olfativa, nombre_perfume, marca, mililitros, isbn_upc, descripcion, precio_venta, imagen_url, modelo_3d_sketchfab, video_youtube_id, activo } = req.body;

    const [check] = await pool.query('SELECT * FROM PRODUCTOS WHERE codproducto = ?', [id]);
    if (check.length === 0) {
      return sendResponse(res, 404, false, 'Producto no encontrado');
    }

    await pool.query(
      `UPDATE PRODUCTOS SET id_proveedor = ?, id_familia_olfativa = ?, nombre_perfume = ?, marca = ?, mililitros = ?, isbn_upc = ?, descripcion = ?, precio_venta = ?, imagen_url = ?, modelo_3d_sketchfab = ?, video_youtube_id = ?, activo = ? 
       WHERE codproducto = ?`,
      [id_proveedor, id_familia_olfativa, nombre_perfume, marca, mililitros, isbn_upc, descripcion, precio_venta, imagen_url, modelo_3d_sketchfab, video_youtube_id, activo, id]
    );

    return sendResponse(res, 200, true, 'Producto actualizado correctamente', { id, ...req.body });
  } catch (error) {
    return sendResponse(res, 500, false, `Error en el servidor: ${error.message}`);
  }
};

// DELETE: Eliminar producto
exports.deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM PRODUCTOS WHERE codproducto = ?', [id]);

    if (result.affectedRows === 0) {
      return sendResponse(res, 404, false, 'Producto no encontrado');
    }

    return sendResponse(res, 200, true, 'Producto eliminado correctamente', null);
  } catch (error) {
    return sendResponse(res, 500, false, `Error en el servidor: ${error.message}`);
  }
};