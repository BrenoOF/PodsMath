const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middleware/authMiddleware');
const permissionsMiddleware = require('../middleware/permissionsMiddleware');
const { upload, processImage } = require('../middleware/uploadMiddleware');

router.get('/', authMiddleware, permissionsMiddleware('Ver Usuarios'), usuarioController.getAllUsuarios);
router.get('/me', authMiddleware, usuarioController.getMe);
router.get('/:id', authMiddleware, permissionsMiddleware('Ver Usuarios'), usuarioController.getUsuarioById);
router.post('/', authMiddleware, permissionsMiddleware('Criar Usuarios'), upload.single('imagem'), processImage, usuarioController.createUsuario);
router.put('/me', authMiddleware, usuarioController.updateMe);
router.put('/me/senha', authMiddleware, usuarioController.updatePassword);
router.put('/me/image', authMiddleware, upload.single('imagem'), processImage, usuarioController.updateMyImage);
router.put('/:id/nivel-acesso', authMiddleware, permissionsMiddleware('Editar Usuarios'), usuarioController.updateUsuarioNivelAcesso);
router.put('/:id', authMiddleware, permissionsMiddleware('Editar Usuarios'), upload.single('imagem'), processImage, usuarioController.updateUsuario);
router.delete('/me', authMiddleware, usuarioController.deleteMe);
router.delete('/:id', authMiddleware, permissionsMiddleware('Excluir Usuarios'), usuarioController.deleteUsuario);

module.exports = router;
