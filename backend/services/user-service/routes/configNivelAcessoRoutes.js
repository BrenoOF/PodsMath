const express = require('express');
const router = express.Router();
const configNivelAcessoController = require('../controllers/configNivelAcessoController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, configNivelAcessoController.getAllConfigNivelAcesso);
router.get('/:id', authMiddleware, configNivelAcessoController.getConfigNivelAcessoById);
router.post('/', authMiddleware, configNivelAcessoController.createConfigNivelAcesso);
router.put('/:id', authMiddleware, configNivelAcessoController.updateConfigNivelAcesso);
router.delete('/:id', authMiddleware, configNivelAcessoController.deleteConfigNivelAcesso);

module.exports = router;
