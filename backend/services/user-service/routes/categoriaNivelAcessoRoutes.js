const express = require('express');
const router = express.Router();
const categoriaNivelAcessoController = require('../controllers/categoriaNivelAcessoController');
const authMiddleware = require('../middleware/authMiddleware');
const permissionsMiddleware = require('../middleware/permissionsMiddleware');

router.get('/', authMiddleware, permissionsMiddleware('Ver Nivel de Acesso'), categoriaNivelAcessoController.getAllCategoriasNivelAcesso);
router.get('/:id', authMiddleware, permissionsMiddleware('Ver Nivel de Acesso'), categoriaNivelAcessoController.getCategoriaNivelAcessoById);
router.post('/', authMiddleware, permissionsMiddleware('Criar Categoria Acesso'), categoriaNivelAcessoController.createCategoriaNivelAcesso);
router.put('/:id', authMiddleware, permissionsMiddleware('Editar Categoria Acesso'), categoriaNivelAcessoController.updateCategoriaNivelAcesso);
router.delete('/:id', authMiddleware, permissionsMiddleware('Excluir Categoria Acesso'), categoriaNivelAcessoController.deleteCategoriaNivelAcesso);

module.exports = router;
