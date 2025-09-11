const express = require('express');
const router = express.Router();
const historicoController = require('../controllers/historicoController');

router.get('/', historicoController.getAllHistoricos);
router.get('/:id', historicoController.getHistoricoById);
router.post('/', historicoController.createHistorico);
router.put('/:id', historicoController.updateHistorico);
router.delete('/:id', historicoController.deleteHistorico);

module.exports = router;
