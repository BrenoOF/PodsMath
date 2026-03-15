const express = require('express');
const router = express.Router();
const instituicaoController = require('../controllers/instituicaoController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, instituicaoController.getAllInstituicaos);
router.get('/:id', authMiddleware, instituicaoController.getInstituicaoById);
router.post('/', authMiddleware, instituicaoController.createInstituicao);
router.put('/:id', authMiddleware, instituicaoController.updateInstituicao);
router.delete('/:id', authMiddleware, instituicaoController.deleteInstituicao);

module.exports = router;
