const express = require('express');
const router = express.Router();
const temaController = require('../controllers/temaController');

router.get('/', temaController.getAllTemas);
router.get('/:id', temaController.getTemaById);
router.post('/', temaController.createTema);
router.put('/:id', temaController.updateTema);
router.delete('/:id', temaController.deleteTema);

module.exports = router;
