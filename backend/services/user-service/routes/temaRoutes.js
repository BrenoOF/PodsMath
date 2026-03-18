const express = require('express');
const router = express.Router();
const temaController = require('../controllers/temaController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', temaController.getAllTemas);
router.get('/destaque', temaController.getTemasDestaque);
router.get('/categoria/:idCategoria', temaController.getTemasByCategoria);
router.get('/:id', temaController.getTemaById);
router.post('/', authMiddleware, temaController.createTema);
router.put('/:id', authMiddleware, temaController.updateTema);
router.delete('/:id', authMiddleware, temaController.deleteTema);

module.exports = router;
