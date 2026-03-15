const express = require('express');
const router = express.Router();
const imagemController = require('../controllers/imagemController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, imagemController.getAllImagems);
router.get('/:id', authMiddleware, imagemController.getImagemById);
router.post('/', authMiddleware, imagemController.createImagem);
router.put('/:id', authMiddleware, imagemController.updateImagem);
router.delete('/:id', authMiddleware, imagemController.deleteImagem);

module.exports = router;
