const express = require('express');
const router = express.Router();
const nivelAcessoController = require('../controllers/nivelAcessoController');

router.get('/', nivelAcessoController.getAllNivelAcessos);
router.get('/:id', nivelAcessoController.getNivelAcessoById);
router.post('/', nivelAcessoController.createNivelAcesso);
router.put('/:id', nivelAcessoController.updateNivelAcesso);
router.delete('/:id', nivelAcessoController.deleteNivelAcesso);

module.exports = router;
