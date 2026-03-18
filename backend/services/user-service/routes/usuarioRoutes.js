const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middleware/authMiddleware');
const { upload, processImage } = require('../middleware/uploadMiddleware');

router.get('/', authMiddleware, usuarioController.getAllUsuarios);
router.get('/me', authMiddleware, usuarioController.getMe);
router.get('/:id', authMiddleware, usuarioController.getUsuarioById);
router.post('/', usuarioController.createUsuario);
router.put('/me', authMiddleware, usuarioController.updateMe);
router.put('/me/senha', authMiddleware, usuarioController.updatePassword);
router.put('/me/image', authMiddleware, upload.single('imagem'), processImage, usuarioController.updateMyImage);
router.put('/:id', authMiddleware, usuarioController.updateUsuario);
router.delete('/me', authMiddleware, usuarioController.deleteMe);
router.delete('/:id', authMiddleware, usuarioController.deleteUsuario);

module.exports = router;
