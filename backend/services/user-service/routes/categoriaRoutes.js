const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const authMiddleware = require('../middleware/authMiddleware');
const { upload, processImage } = require('../middleware/uploadMiddleware');

router.get('/', categoriaController.getAllCategorias);
router.get('/:id', categoriaController.getCategoriaById);
router.post('/', authMiddleware, upload.single('imagem'), processImage, categoriaController.createCategoria);
router.put('/:id', authMiddleware, upload.single('imagem'), processImage, categoriaController.updateCategoria);
router.delete('/:id', authMiddleware, categoriaController.deleteCategoria);

module.exports = router;
