const express = require('express');
const router = express.Router();
const categoriaNivelAcessoController = require('../controllers/categoriaNivelAcessoController');

router.get('/', categoriaNivelAcessoController.getAllCategoriasNivelAcesso);
router.get('/:id', categoriaNivelAcessoController.getCategoriaNivelAcessoById);
router.post('/', categoriaNivelAcessoController.createCategoriaNivelAcesso);
router.put('/:id', categoriaNivelAcessoController.updateCategoriaNivelAcesso);
router.delete('/:id', categoriaNivelAcessoController.deleteCategoriaNivelAcesso);

module.exports = router;
