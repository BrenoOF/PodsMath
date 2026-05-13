const express = require('express');
const router = express.Router();
const instituicaoController = require('../controllers/instituicaoController');
const authMiddleware = require('../middleware/authMiddleware');
const { upload, processImage } = require('../middleware/uploadMiddleware');

router.get('/', authMiddleware, instituicaoController.getAllInstituicaos);
router.get('/:id', authMiddleware, instituicaoController.getInstituicaoById);
router.post('/', authMiddleware, upload.single('imagem'), processImage, instituicaoController.createInstituicao);
router.put('/:id', authMiddleware, upload.single('imagem'), processImage, instituicaoController.updateInstituicao);
router.delete('/:id', authMiddleware, instituicaoController.deleteInstituicao);

module.exports = router;
