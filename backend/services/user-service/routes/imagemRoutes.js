const express = require('express');
const router = express.Router();
const { upload, processImage } = require('../middleware/uploadMiddleware');
const imagemController = require('../controllers/imagemController');
const authMiddleware = require('../middleware/authMiddleware');
const permissionsMiddleware = require('../middleware/permissionsMiddleware');

router.get('/', authMiddleware, permissionsMiddleware('Ver Auditoria'), imagemController.getAllImagems);
router.get('/file/:filename', imagemController.serveImage);
router.get('/:id', authMiddleware, permissionsMiddleware('Ver Auditoria'), imagemController.getImagemById);
router.post('/', authMiddleware, permissionsMiddleware('Importar Imagens'), upload.single('imagem'), processImage, imagemController.createImagem);
router.put('/:id', authMiddleware, permissionsMiddleware('Importar Imagens'), upload.single('imagem'), processImage, imagemController.updateImagem);
router.delete('/:id', authMiddleware, permissionsMiddleware('Excluir Imagens'), imagemController.deleteImagem);

module.exports = router;
