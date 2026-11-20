const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const createUploader = require('../middlewares/upload');

const uploadProducto = createUploader('productos');

router.get('/', productoController.getAllProductos);
router.get('/:id', productoController.getProductoById);
router.post('/', uploadProducto.single('imagen'), productoController.createProducto);
router.put('/:id', uploadProducto.single('imagen'), productoController.updateProducto);
router.delete('/:id', productoController.deleteProducto);

module.exports = router;