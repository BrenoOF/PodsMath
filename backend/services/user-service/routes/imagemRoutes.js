const express = require('express');
const router = express.Router();
const imagemController = require('../controllers/imagemController');

router.get('/', imagemController.getAllImagems);
router.get('/:id', imagemController.getImagemById);
router.post('/', imagemController.createImagem);
router.put('/:id', imagemController.updateImagem);
router.delete('/:id', imagemController.deleteImagem);

module.exports = router;
