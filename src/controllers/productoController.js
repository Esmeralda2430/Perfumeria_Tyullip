const pool = require('../config/db');
const sendResponse = require('../utils/responseHandler');
const { deleteFile } = require('../utils/fileHelper');

// GET: Todos los productos (retorna también la ruta de la imagen)
exports.getAllProductos = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM PRODUCTOS');
    return sendResponse(res, 200, true, 'Lista de productos consultada correctamente', rows);
  } catch (error) {
    return sendResponse(res, 500, false, `Error en el servidor: ${error.message}`);
  }
};

// GET: Producto por ID
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

// POST: Crear producto (con soporte de imagen multipart/form-data)
exports.createProducto = async (req, res) => {
  try {
    const { id_proveedor, id_familia_olfativa, nombre_perfume, marca, mililitros, isbn_upc, descripcion, precio_venta } = req.body;

    if (!id_proveedor || !id_familia_olfativa || !nombre_perfume || !precio_venta) {
      if (req.file) deleteFile(`/uploads/productos/${req.file.filename}`);
      return sendResponse(res, 400, false, 'Los campos id_proveedor, id_familia_olfativa, nombre_perfume y precio_venta son obligatorios');
    }

    const imagen = req.file ? `/uploads/productos/${req.file.filename}` : null;

    const [result] = await pool.query(
      `INSERT INTO PRODUCTOS (id_proveedor, id_familia_olfativa, nombre_perfume, marca, mililitros, isbn_upc, descripcion, precio_venta, imagen) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id_proveedor, id_familia_olfativa, nombre_perfume, marca, mililitros, isbn_upc, descripcion, precio_venta, imagen]
    );

    const newProducto = {
      id: result.insertId,
      ...req.body,
      imagen
    };

    return sendResponse(res, 201, true, 'Producto creado correctamente', newProducto);
  } catch (error) {
    if (req.file) deleteFile(`/uploads/productos/${req.file.filename}`);
    return sendResponse(res, 500, false, `Error en el servidor: ${error.message}`);
  }
};

// PUT: Actualizar producto (reemplaza imagen anterior si se sube una nueva)
exports.updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const [check] = await pool.query('SELECT * FROM PRODUCTOS WHERE codproducto = ?', [id]);

    if (check.length === 0) {
      if (req.file) deleteFile(`/uploads/productos/${req.file.filename}`);
      return sendResponse(res, 404, false, 'Producto no encontrado');
    }

    const currentProducto = check[0];
    let imagen = currentProducto.imagen;

    if (req.file) {
      // Elimina la imagen previa si existe
      deleteFile(currentProducto.imagen);
      imagen = `/uploads/productos/${req.file.filename}`;
    }

    const { id_proveedor, id_familia_olfativa, nombre_perfume, marca, mililitros, isbn_upc, descripcion, precio_venta, activo } = req.body;

    await pool.query(
      `UPDATE PRODUCTOS SET id_proveedor = ?, id_familia_olfativa = ?, nombre_perfume = ?, marca = ?, mililitros = ?, isbn_upc = ?, descripcion = ?, precio_venta = ?, imagen = ?, activo = ? 
       WHERE codproducto = ?`,
      [
        id_proveedor || currentProducto.id_proveedor,
        id_familia_olfativa || currentProducto.id_familia_olfativa,
        nombre_perfume || currentProducto.nombre_perfume,
        marca || currentProducto.marca,
        mililitros || currentProducto.mililitros,
        isbn_upc || currentProducto.isbn_upc,
        descripcion || currentProducto.descripcion,
        precio_venta || currentProducto.precio_venta,
        imagen,
        activo !== undefined ? activo : currentProducto.activo,
        id
      ]
    );

    return sendResponse(res, 200, true, 'Producto actualizado correctamente', {
      id: parseInt(id),
      ...req.body,
      imagen
    });
  } catch (error) {
    if (req.file) deleteFile(`/uploads/productos/${req.file.filename}`);
    return sendResponse(res, 500, false, `Error en el servidor: ${error.message}`);
  }
};

// DELETE: Eliminar producto (elimina también el archivo de imagen del servidor)
exports.deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const [check] = await pool.query('SELECT imagen FROM PRODUCTOS WHERE codproducto = ?', [id]);

    if (check.length === 0) {
      return sendResponse(res, 404, false, 'Producto no encontrado');
    }

    deleteFile(check[0].imagen);

    await pool.query('DELETE FROM PRODUCTOS WHERE codproducto = ?', [id]);
    return sendResponse(res, 200, true, 'Producto y su imagen asociados fueron eliminados correctamente', null);
  } catch (error) {
    return sendResponse(res, 500, false, `Error en el servidor: ${error.message}`);
  }
};