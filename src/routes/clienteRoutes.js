const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const createUploader = require('../middlewares/upload');

const uploadCliente = createUploader('clientes');

router.get('/', clienteController.getAllClientes);
router.get('/:id', clienteController.getClienteById);
router.post('/', uploadCliente.single('imagen'), clienteController.createCliente);
router.put('/:id', uploadCliente.single('imagen'), clienteController.updateCliente);
router.delete('/:id', clienteController.deleteCliente);

module.exports = router;