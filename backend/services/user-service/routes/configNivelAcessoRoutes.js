const express = require('express');
const router = express.Router();
const configNivelAcessoController = require('../controllers/configNivelAcessoController');

router.get('/', configNivelAcessoController.getAllConfigNivelAcesso);
router.get('/:id', configNivelAcessoController.getConfigNivelAcessoById);
router.post('/', configNivelAcessoController.createConfigNivelAcesso);
router.put('/:id', configNivelAcessoController.updateConfigNivelAcesso);
router.delete('/:id', configNivelAcessoController.deleteConfigNivelAcesso);

module.exports = router;
