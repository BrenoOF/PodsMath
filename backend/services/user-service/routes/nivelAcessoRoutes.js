const express = require('express');
const router = express.Router();
const nivelAcessoController = require('../controllers/nivelAcessoController');
const authMiddleware = require('../middleware/authMiddleware');
const permissionsMiddleware = require('../middleware/permissionsMiddleware');

router.get('/', authMiddleware, permissionsMiddleware('Ver Nivel de Acesso'), nivelAcessoController.getAllNivelAcessos);
router.get('/:id', authMiddleware, permissionsMiddleware('Ver Nivel de Acesso'), nivelAcessoController.getNivelAcessoById);
router.post('/', authMiddleware, permissionsMiddleware('Criar Nivel de Acesso'), nivelAcessoController.createNivelAcesso);
router.put('/:id', authMiddleware, permissionsMiddleware('Editar Nivel de Acesso'), nivelAcessoController.updateNivelAcesso);
router.delete('/:id', authMiddleware, permissionsMiddleware('Excluir Nivel de Acesso'), nivelAcessoController.deleteNivelAcesso);

module.exports = router;
