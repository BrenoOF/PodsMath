const express = require('express');
const router = express.Router();
const transcricaoController = require('../controllers/transcricaoController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', transcricaoController.getAllTranscricaos);
router.get('/audio/:audioId', transcricaoController.getTranscricaoByAudioId);
router.get('/:id', transcricaoController.getTranscricaoById);
router.post('/', authMiddleware, transcricaoController.createTranscricao);
router.put('/:id', authMiddleware, transcricaoController.updateTranscricao);
router.delete('/:id', authMiddleware, transcricaoController.deleteTranscricao);
router.delete('/audio/:audioId', authMiddleware, transcricaoController.deleteTranscricaoByAudioId);

module.exports = router;
