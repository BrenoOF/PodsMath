const express = require('express');
const router = express.Router();
const favoritoController = require('../controllers/favoritoController');

router.get('/', favoritoController.getAllFavoritos);
router.get('/usuario/:usuarioId', favoritoController.getFavoritosByUsuarioId);
router.post('/', favoritoController.createFavorito);
router.delete('/:usuarioId/:audioId', favoritoController.deleteFavorito);

module.exports = router;
