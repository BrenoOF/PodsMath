const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, usuarioController.getAllUsuarios);
router.get('/:id', authMiddleware, usuarioController.getUsuarioById);
router.post('/', usuarioController.createUsuario);
router.put('/:id', authMiddleware, usuarioController.updateUsuario);
router.delete('/:id', authMiddleware, usuarioController.deleteUsuario);

module.exports = router;
