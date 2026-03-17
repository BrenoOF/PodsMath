const express = require('express');
const router = express.Router();
const { upload, processImage } = require('../middleware/uploadMiddleware');
const imagemController = require('../controllers/imagemController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, imagemController.getAllImagems);
router.get('/file/:filename', imagemController.serveImage);
router.get('/:id', authMiddleware, imagemController.getImagemById);
router.post('/', authMiddleware, upload.single('imagem'), processImage, imagemController.createImagem);
router.put('/:id', authMiddleware, upload.single('imagem'), processImage, imagemController.updateImagem);
router.delete('/:id', authMiddleware, imagemController.deleteImagem);

module.exports = router;
