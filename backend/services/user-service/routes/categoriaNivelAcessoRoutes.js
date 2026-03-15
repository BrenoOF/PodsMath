const express = require('express');
const router = express.Router();
const categoriaNivelAcessoController = require('../controllers/categoriaNivelAcessoController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, categoriaNivelAcessoController.getAllCategoriasNivelAcesso);
router.get('/:id', authMiddleware, categoriaNivelAcessoController.getCategoriaNivelAcessoById);
router.post('/', authMiddleware, categoriaNivelAcessoController.createCategoriaNivelAcesso);
router.put('/:id', authMiddleware, categoriaNivelAcessoController.updateCategoriaNivelAcesso);
router.delete('/:id', authMiddleware, categoriaNivelAcessoController.deleteCategoriaNivelAcesso);

module.exports = router;
