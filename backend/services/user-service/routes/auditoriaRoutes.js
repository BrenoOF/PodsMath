const express = require('express');
const router = express.Router();
const auditoriaController = require('../controllers/auditoriaController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, auditoriaController.getAllAuditorias);
router.get('/:id', authMiddleware, auditoriaController.getAuditoriaById);
router.post('/', authMiddleware, auditoriaController.createAuditoria);
router.put('/:id', authMiddleware, auditoriaController.updateAuditoria);
router.delete('/:id', authMiddleware, auditoriaController.deleteAuditoria);

module.exports = router;
