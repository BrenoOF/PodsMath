const express = require('express');
const router = express.Router();
const audioController = require('../controllers/audioController');
const authMiddleware = require('../middleware/authMiddleware');
const permissionsMiddleware = require('../middleware/permissionsMiddleware');
const { upload, processImage } = require('../middleware/uploadMiddleware');

router.get('/', authMiddleware, audioController.getAllAudios);
router.get('/tema/:idTema', audioController.getAudiosByTema);
router.get('/destaque', audioController.getHighlights);
router.get('/recentes', audioController.getRecent);
router.get('/proprios', authMiddleware, audioController.getOwnAudios);
router.get('/pesquisar', audioController.searchAudios);
router.get('/:id', audioController.getAudioById);
router.get('/:id/details', audioController.getAudioDetailsById);
router.post('/:id/visualizacao', audioController.incrementViews);
router.post('/', authMiddleware, permissionsMiddleware('Criar Audios'), upload.single('imagem'), processImage, audioController.createAudio);
router.put('/:id', authMiddleware, permissionsMiddleware('Editar Audios'), upload.single('imagem'), processImage, audioController.updateAudio);
router.delete('/:id', authMiddleware, permissionsMiddleware('Excluir Audios'), audioController.deleteAudio);

module.exports = router;
