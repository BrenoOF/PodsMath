const express = require('express');
const router = express.Router();
const paletaCorController = require('../controllers/paletaCorController');
const authMiddleware = require('../middleware/authMiddleware');
const permissionsMiddleware = require('../middleware/permissionsMiddleware');

router.get('/', authMiddleware, paletaCorController.getAllPaletaCors);
router.get('/:id', authMiddleware, paletaCorController.getPaletaCorById);
router.post('/', authMiddleware, permissionsMiddleware('Criar Paleta Cor'), paletaCorController.createPaletaCor);
router.put('/:id', authMiddleware, permissionsMiddleware('Editar Paleta Cor'), paletaCorController.updatePaletaCor);
router.delete('/:id', authMiddleware, permissionsMiddleware('Excluir Paleta Cor'), paletaCorController.deletePaletaCor);

module.exports = router;
