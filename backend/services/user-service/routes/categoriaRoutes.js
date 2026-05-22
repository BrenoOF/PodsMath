const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const authMiddleware = require('../middleware/authMiddleware');
const permissionsMiddleware = require('../middleware/permissionsMiddleware');
const { upload, processImage } = require('../middleware/uploadMiddleware');

router.get('/', categoriaController.getAllCategorias);
router.get('/:id', categoriaController.getCategoriaById);
router.post('/', authMiddleware, permissionsMiddleware('Criar Categoria'), upload.single('imagem'), processImage, categoriaController.createCategoria);
router.put('/:id', authMiddleware, permissionsMiddleware('Editar Categoria'), upload.single('imagem'), processImage, categoriaController.updateCategoria);
router.delete('/:id', authMiddleware, permissionsMiddleware('Excluir Categoria'), categoriaController.deleteCategoria);

module.exports = router;
