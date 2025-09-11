const express = require('express');
const router = express.Router();
const instituicaoController = require('../controllers/instituicaoController');

router.get('/', instituicaoController.getAllInstituicaos);
router.get('/:id', instituicaoController.getInstituicaoById);
router.post('/', instituicaoController.createInstituicao);
router.put('/:id', instituicaoController.updateInstituicao);
router.delete('/:id', instituicaoController.deleteInstituicao);

module.exports = router;
