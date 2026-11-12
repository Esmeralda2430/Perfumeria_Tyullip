const pool = require('../config/db');
const sendResponse = require('../utils/responseHandler');

// GET: Obtener todos los clientes
exports.getAllClientes = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT numcliente, nif_rfc, nombre, apellidos, email, telefono, direccion, codciudad, cp, fecha_registro, estado_cuenta FROM CLIENTES');
    return sendResponse(res, 200, true, 'Lista de clientes consultada correctamente', rows);
  } catch (error) {
    return sendResponse(res, 500, false, `Error en el servidor: ${error.message}`);
  }
};

// GET: Obtener cliente por ID
exports.getClienteById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT numcliente, nif_rfc, nombre, apellidos, email, telefono, direccion, codciudad, cp, fecha_registro, estado_cuenta FROM CLIENTES WHERE numcliente = ?', [id]);
    
    if (rows.length === 0) {
      return sendResponse(res, 404, false, 'Cliente no encontrado');
    }

    return sendResponse(res, 200, true, 'Cliente consultado correctamente', rows[0]);
  } catch (error) {
    return sendResponse(res, 500, false, `Error en el servidor: ${error.message}`);
  }
};

// POST: Crear cliente
exports.createCliente = async (req, res) => {
  try {
    const { nif_rfc, nombre, apellidos, email, password, telefono, direccion, codciudad, cp } = req.body;

    if (!nif_rfc || !nombre || !apellidos || !email || !password) {
      return sendResponse(res, 400, false, 'Los campos nif_rfc, nombre, apellidos, email y password son obligatorios');
    }

    const [result] = await pool.query(
      `INSERT INTO CLIENTES (nif_rfc, nombre, apellidos, email, password, telefono, direccion, codciudad, cp) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nif_rfc, nombre, apellidos, email, password, telefono, direccion, codciudad, cp]
    );

    const newCliente = { id: result.insertId, nif_rfc, nombre, apellidos, email };
    return sendResponse(res, 201, true, 'Cliente creado correctamente', newCliente);
  } catch (error) {
    return sendResponse(res, 500, false, `Error en el servidor: ${error.message}`);
  }
};

// PUT: Actualizar cliente
exports.updateCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nif_rfc, nombre, apellidos, email, telefono, direccion, codciudad, cp, estado_cuenta } = req.body;

    const [check] = await pool.query('SELECT * FROM CLIENTES WHERE numcliente = ?', [id]);
    if (check.length === 0) {
      return sendResponse(res, 404, false, 'Cliente no encontrado');
    }

    await pool.query(
      `UPDATE CLIENTES SET nif_rfc = ?, nombre = ?, apellidos = ?, email = ?, telefono = ?, direccion = ?, codciudad = ?, cp = ?, estado_cuenta = ? 
       WHERE numcliente = ?`,
      [nif_rfc, nombre, apellidos, email, telefono, direccion, codciudad, cp, estado_cuenta, id]
    );

    return sendResponse(res, 200, true, 'Cliente actualizado correctamente', { id, ...req.body });
  } catch (error) {
    return sendResponse(res, 500, false, `Error en el servidor: ${error.message}`);
  }
};

// DELETE: Eliminar cliente
exports.deleteCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM CLIENTES WHERE numcliente = ?', [id]);

    if (result.affectedRows === 0) {
      return sendResponse(res, 404, false, 'Cliente no encontrado');
    }

    return sendResponse(res, 200, true, 'Cliente eliminado correctamente', null);
  } catch (error) {
    return sendResponse(res, 500, false, `Error en el servidor: ${error.message}`);
  }
};