const express = require('express');
const router = express.Router();
const idiomaController = require('../controllers/idiomaController');
const authMiddleware = require('../middleware/authMiddleware');
const permissionsMiddleware = require('../middleware/permissionsMiddleware');

router.get('/', authMiddleware, idiomaController.getAllIdiomas);
router.get('/:id', authMiddleware, idiomaController.getIdiomaById);
router.post('/', authMiddleware, permissionsMiddleware('Criar Idiomas'), idiomaController.createIdioma);
router.put('/:id', authMiddleware, permissionsMiddleware('Editar Idiomas'), idiomaController.updateIdioma);
router.delete('/:id', authMiddleware, permissionsMiddleware('Excluir Idiomas'), idiomaController.deleteIdioma);

module.exports = router;
