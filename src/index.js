const express = require('express');
const cors = require('cors');
require('dotenv').config();

const productoRoutes = require('./routes/productoRoutes');
const clienteRoutes = require('./routes/clienteRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Configuración para recibir datos en JSON

// Rutas de las entidades
app.use('/api/productos', productoRoutes);
app.use('/api/clientes', clienteRoutes);

// Ruta base de prueba
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API REST Perfumería Tyullip funcionando correctamente',
    data: null
  });
});

// Manejador de rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    data: null
  });
});

app.listen(PORT, () => {
  console.log(`Servidor de Perfumería Tyullip ejecutándose en http://localhost:${PORT}`);
});