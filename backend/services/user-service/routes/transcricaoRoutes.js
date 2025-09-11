const express = require('express');
const router = express.Router();
const transcricaoController = require('../controllers/transcricaoController');

router.get('/', transcricaoController.getAllTranscricaos);
router.get('/:id', transcricaoController.getTranscricaoById);
router.post('/', transcricaoController.createTranscricao);
router.put('/:id', transcricaoController.updateTranscricao);
router.delete('/:id', transcricaoController.deleteTranscricao);

module.exports = router;
