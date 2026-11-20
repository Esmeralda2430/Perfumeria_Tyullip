const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
require('dotenv').config();

const productoRoutes = require('./routes/productoRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const sendResponse = require('./utils/responseHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares base
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para servir la carpeta uploads como contenido estático
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rutas de las entidades
app.use('/api/productos', productoRoutes);
app.use('/api/clientes', clienteRoutes);

// Manejador global de errores (incluye errores de Multer)
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return sendResponse(res, 400, false, 'El archivo excede el tamaño máximo permitido (5MB)', null);
    }
    return sendResponse(res, 400, false, `Error en la carga del archivo: ${err.message}`, null);
  } else if (err) {
    return sendResponse(res, 400, false, err.message, null);
  }
  next();
});

// Ruta de fallback 404
app.use((req, res) => {
  sendResponse(res, 404, false, 'Ruta no encontrada', null);
});

app.listen(PORT, () => {
  console.log(`Servidor con soporte de imágenes ejecutándose en http://localhost:${PORT}`);
});