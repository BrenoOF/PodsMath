const express = require('express');
const router = express.Router();
const idiomaController = require('../controllers/idiomaController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, idiomaController.getAllIdiomas);
router.get('/:id', authMiddleware, idiomaController.getIdiomaById);
router.post('/', authMiddleware, idiomaController.createIdioma);
router.put('/:id', authMiddleware, idiomaController.updateIdioma);
router.delete('/:id', authMiddleware, idiomaController.deleteIdioma);

module.exports = router;
