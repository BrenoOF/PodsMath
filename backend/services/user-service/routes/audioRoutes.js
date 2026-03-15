const express = require('express');
const router = express.Router();
const audioController = require('../controllers/audioController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, audioController.getAllAudios);
router.get('/:id', authMiddleware, audioController.getAudioById);
router.get('/:id/details', authMiddleware, audioController.getAudioDetailsById);
router.post('/', authMiddleware, audioController.createAudio);
router.put('/:id', authMiddleware, audioController.updateAudio);
router.delete('/:id', authMiddleware, audioController.deleteAudio);

module.exports = router;
