const express = require('express');
const router = express.Router();
const temaController = require('../controllers/temaController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, temaController.getAllTemas);
router.get('/destaque', authMiddleware, temaController.getTemasDestaque);
router.get('/categoria/:idCategoria', authMiddleware, temaController.getTemasByCategoria);
router.get('/:id', authMiddleware, temaController.getTemaById);
router.post('/', authMiddleware, temaController.createTema);
router.put('/:id', authMiddleware, temaController.updateTema);
router.delete('/:id', authMiddleware, temaController.deleteTema);

module.exports = router;
