const express = require('express');
const router = express.Router();
const paletaCorController = require('../controllers/paletaCorController');

router.get('/', paletaCorController.getAllPaletaCors);
router.get('/:id', paletaCorController.getPaletaCorById);
router.post('/', paletaCorController.createPaletaCor);
router.put('/:id', paletaCorController.updatePaletaCor);
router.delete('/:id', paletaCorController.deletePaletaCor);

module.exports = router;
