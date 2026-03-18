const express = require('express');
const router = express.Router();
const historicoController = require('../controllers/historicoController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, historicoController.getAllHistoricos);
router.get('/me', authMiddleware, historicoController.getHistoricoByUsuarioId);
router.get('/audio/:audioId', authMiddleware, historicoController.getHistoricoByAudio);
router.post('/save', authMiddleware, historicoController.saveHistorico);
router.get('/:id', authMiddleware, historicoController.getHistoricoById);
router.post('/', authMiddleware, historicoController.createHistorico);
router.put('/:id', authMiddleware, historicoController.updateHistorico);
router.delete('/:id', authMiddleware, historicoController.deleteHistorico);

module.exports = router;
