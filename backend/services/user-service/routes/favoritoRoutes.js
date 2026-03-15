const express = require('express');
const router = express.Router();
const favoritoController = require('../controllers/favoritoController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, favoritoController.getAllFavoritos);
router.get('/me', authMiddleware, favoritoController.getFavoritosByUsuarioId);
router.post('/', authMiddleware, favoritoController.createFavorito);
router.delete('/:audioId', authMiddleware, favoritoController.deleteFavorito);

module.exports = router;
