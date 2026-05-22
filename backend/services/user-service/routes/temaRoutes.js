const express = require('express');
const router = express.Router();
const temaController = require('../controllers/temaController');
const authMiddleware = require('../middleware/authMiddleware');
const permissionsMiddleware = require('../middleware/permissionsMiddleware');
const { upload, processImage } = require('../middleware/uploadMiddleware');

router.get('/', temaController.getAllTemas);
router.get('/destaque', temaController.getTemasDestaque);
router.get('/categoria/:idCategoria', temaController.getTemasByCategoria);
router.get('/:id', temaController.getTemaById);
router.post('/', authMiddleware, permissionsMiddleware('Criar Tema'), upload.single('imagem'), processImage, temaController.createTema);
router.put('/:id', authMiddleware, permissionsMiddleware('Editar Tema'), upload.single('imagem'), processImage, temaController.updateTema);
router.delete('/:id', authMiddleware, permissionsMiddleware('Excluir Tema'), temaController.deleteTema);

module.exports = router;
