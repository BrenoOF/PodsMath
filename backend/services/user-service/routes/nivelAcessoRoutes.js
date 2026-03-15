const express = require('express');
const router = express.Router();
const nivelAcessoController = require('../controllers/nivelAcessoController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, nivelAcessoController.getAllNivelAcessos);
router.get('/:id', authMiddleware, nivelAcessoController.getNivelAcessoById);
router.post('/', authMiddleware, nivelAcessoController.createNivelAcesso);
router.put('/:id', authMiddleware, nivelAcessoController.updateNivelAcesso);
router.delete('/:id', authMiddleware, nivelAcessoController.deleteNivelAcesso);

module.exports = router;
