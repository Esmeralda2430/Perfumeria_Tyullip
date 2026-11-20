const pool = require('../config/db');
const sendResponse = require('../utils/responseHandler');
const { deleteFile } = require('../utils/fileHelper');

exports.getAllClientes = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT numcliente, nif_rfc, nombre, apellidos, email, telefono, direccion, codciudad, cp, fecha_registro, estado_cuenta, imagen FROM CLIENTES');
    return sendResponse(res, 200, true, 'Lista de clientes consultada correctamente', rows);
  } catch (error) {
    return sendResponse(res, 500, false, `Error en el servidor: ${error.message}`);
  }
};

exports.getClienteById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT numcliente, nif_rfc, nombre, apellidos, email, telefono, direccion, codciudad, cp, fecha_registro, estado_cuenta, imagen FROM CLIENTES WHERE numcliente = ?', [id]);

    if (rows.length === 0) {
      return sendResponse(res, 404, false, 'Cliente no encontrado');
    }

    return sendResponse(res, 200, true, 'Cliente consultado correctamente', rows[0]);
  } catch (error) {
    return sendResponse(res, 500, false, `Error en el servidor: ${error.message}`);
  }
};

exports.createCliente = async (req, res) => {
  try {
    const { nif_rfc, nombre, apellidos, email, password, telefono, direccion, codciudad, cp } = req.body;

    if (!nif_rfc || !nombre || !apellidos || !email || !password) {
      if (req.file) deleteFile(`/uploads/clientes/${req.file.filename}`);
      return sendResponse(res, 400, false, 'Los campos nif_rfc, nombre, apellidos, email y password son obligatorios');
    }

    const imagen = req.file ? `/uploads/clientes/${req.file.filename}` : null;

    const [result] = await pool.query(
      `INSERT INTO CLIENTES (nif_rfc, nombre, apellidos, email, password, telefono, direccion, codciudad, cp, imagen) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nif_rfc, nombre, apellidos, email, password, telefono, direccion, codciudad, cp, imagen]
    );

    return sendResponse(res, 201, true, 'Cliente creado correctamente', {
      id: result.insertId,
      nombre,
      email,
      imagen
    });
  } catch (error) {
    if (req.file) deleteFile(`/uploads/clientes/${req.file.filename}`);
    return sendResponse(res, 500, false, `Error en el servidor: ${error.message}`);
  }
};

exports.updateCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const [check] = await pool.query('SELECT * FROM CLIENTES WHERE numcliente = ?', [id]);

    if (check.length === 0) {
      if (req.file) deleteFile(`/uploads/clientes/${req.file.filename}`);
      return sendResponse(res, 404, false, 'Cliente no encontrado');
    }

    const currentCliente = check[0];
    let imagen = currentCliente.imagen;

    if (req.file) {
      deleteFile(currentCliente.imagen);
      imagen = `/uploads/clientes/${req.file.filename}`;
    }

    const { nif_rfc, nombre, apellidos, email, telefono, direccion, codciudad, cp, estado_cuenta } = req.body;

    await pool.query(
      `UPDATE CLIENTES SET nif_rfc = ?, nombre = ?, apellidos = ?, email = ?, telefono = ?, direccion = ?, codciudad = ?, cp = ?, estado_cuenta = ?, imagen = ? 
       WHERE numcliente = ?`,
      [
        nif_rfc || currentCliente.nif_rfc,
        nombre || currentCliente.nombre,
        apellidos || currentCliente.apellidos,
        email || currentCliente.email,
        telefono || currentCliente.telefono,
        direccion || currentCliente.direccion,
        codciudad || currentCliente.codciudad,
        cp || currentCliente.cp,
        estado_cuenta || currentCliente.estado_cuenta,
        imagen,
        id
      ]
    );

    return sendResponse(res, 200, true, 'Cliente actualizado correctamente', {
      id: parseInt(id),
      nombre: nombre || currentCliente.nombre,
      imagen
    });
  } catch (error) {
    if (req.file) deleteFile(`/uploads/clientes/${req.file.filename}`);
    return sendResponse(res, 500, false, `Error en el servidor: ${error.message}`);
  }
};

exports.deleteCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const [check] = await pool.query('SELECT imagen FROM CLIENTES WHERE numcliente = ?', [id]);

    if (check.length === 0) {
      return sendResponse(res, 404, false, 'Cliente no encontrado');
    }

    deleteFile(check[0].imagen);

    await pool.query('DELETE FROM CLIENTES WHERE numcliente = ?', [id]);
    return sendResponse(res, 200, true, 'Cliente y su imagen de perfil eliminados correctamente', null);
  } catch (error) {
    return sendResponse(res, 500, false, `Error en el servidor: ${error.message}`);
  }
};