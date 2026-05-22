const express = require('express');
const router = express.Router();
const transcricaoController = require('../controllers/transcricaoController');
const authMiddleware = require('../middleware/authMiddleware');
const permissionsMiddleware = require('../middleware/permissionsMiddleware');

router.get('/', transcricaoController.getAllTranscricaos);
router.get('/audio/:audioId', transcricaoController.getTranscricaoByAudioId);
router.get('/:id', transcricaoController.getTranscricaoById);
router.post('/', authMiddleware, permissionsMiddleware('Editar Transcrição'), transcricaoController.createTranscricao);
router.put('/:id', authMiddleware, permissionsMiddleware('Editar Transcrição'), transcricaoController.updateTranscricao);
router.delete('/:id', authMiddleware, permissionsMiddleware('Excluir Audios'), transcricaoController.deleteTranscricao);
router.delete('/audio/:audioId', authMiddleware, permissionsMiddleware('Excluir Audios'), transcricaoController.deleteTranscricaoByAudioId);

module.exports = router;
