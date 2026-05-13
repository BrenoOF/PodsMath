const express = require('express');
const router = express.Router();
const paletaCorController = require('../controllers/paletaCorController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, paletaCorController.getAllPaletaCors);
router.get('/:id', authMiddleware, paletaCorController.getPaletaCorById);
router.post('/', authMiddleware, paletaCorController.createPaletaCor);
router.put('/:id', authMiddleware, paletaCorController.updatePaletaCor);
router.delete('/:id', authMiddleware, paletaCorController.deletePaletaCor);

module.exports = router;
