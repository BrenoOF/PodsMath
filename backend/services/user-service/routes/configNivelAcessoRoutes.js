const express = require('express');
const router = express.Router();
const configNivelAcessoController = require('../controllers/configNivelAcessoController');
const authMiddleware = require('../middleware/authMiddleware');
const permissionsMiddleware = require('../middleware/permissionsMiddleware');

router.get('/', authMiddleware, permissionsMiddleware('Ver Nivel de Acesso'), configNivelAcessoController.getAllConfigNivelAcesso);
router.get('/:id', authMiddleware, permissionsMiddleware('Ver Nivel de Acesso'), configNivelAcessoController.getConfigNivelAcessoById);
router.post('/', authMiddleware, permissionsMiddleware('Criar Configuração'), configNivelAcessoController.createConfigNivelAcesso);
router.put('/:id', authMiddleware, permissionsMiddleware('Editar Configuração'), configNivelAcessoController.updateConfigNivelAcesso);
router.delete('/:id', authMiddleware, permissionsMiddleware('Excluir Configuração'), configNivelAcessoController.deleteConfigNivelAcesso);

module.exports = router;
