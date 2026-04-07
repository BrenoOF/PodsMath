const express = require('express');
const router = express.Router();
const audioController = require('../controllers/audioController');
const authMiddleware = require('../middleware/authMiddleware');
const { upload, processImage } = require('../middleware/uploadMiddleware');

router.get('/', authMiddleware, audioController.getAllAudios);
router.get('/tema/:idTema', audioController.getAudiosByTema);
router.get('/destaque', audioController.getHighlights);
router.get('/recentes', audioController.getRecent);
router.get('/proprios', authMiddleware, audioController.getOwnAudios);
router.get('/:id', audioController.getAudioById);
router.get('/:id/details', audioController.getAudioDetailsById);
router.post('/:id/visualizacao', audioController.incrementViews);
router.post('/', authMiddleware, upload.single('imagem'), processImage, audioController.createAudio);
router.put('/:id', authMiddleware, upload.single('imagem'), processImage, audioController.updateAudio);
router.delete('/:id', authMiddleware, audioController.deleteAudio);

module.exports = router;
