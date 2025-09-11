const express = require('express');
const router = express.Router();
const idiomaController = require('../controllers/idiomaController');

router.get('/', idiomaController.getAllIdiomas);
router.get('/:id', idiomaController.getIdiomaById);
router.post('/', idiomaController.createIdioma);
router.put('/:id', idiomaController.updateIdioma);
router.delete('/:id', idiomaController.deleteIdioma);

module.exports = router;
