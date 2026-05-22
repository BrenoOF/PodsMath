const express = require('express');
const router = express.Router();
const instituicaoController = require('../controllers/instituicaoController');
const authMiddleware = require('../middleware/authMiddleware');
const permissionsMiddleware = require('../middleware/permissionsMiddleware');
const { upload, processImage } = require('../middleware/uploadMiddleware');

router.get('/', authMiddleware, instituicaoController.getAllInstituicaos);
router.get('/:id', authMiddleware, instituicaoController.getInstituicaoById);
router.post('/', authMiddleware, permissionsMiddleware('Criar Instituições'), upload.single('imagem'), processImage, instituicaoController.createInstituicao);
router.put('/:id', authMiddleware, permissionsMiddleware('Editar Instituições'), upload.single('imagem'), processImage, instituicaoController.updateInstituicao);
router.delete('/:id', authMiddleware, permissionsMiddleware('Excluir Instituições'), instituicaoController.deleteInstituicao);

module.exports = router;
