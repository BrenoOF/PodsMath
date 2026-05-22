const express = require('express');
const router = express.Router();
const auditoriaController = require('../controllers/auditoriaController');
const authMiddleware = require('../middleware/authMiddleware');
const permissionsMiddleware = require('../middleware/permissionsMiddleware');

router.get('/', authMiddleware, permissionsMiddleware('Ver Auditoria'), auditoriaController.getAllAuditorias);
router.get('/:id', authMiddleware, permissionsMiddleware('Ver Auditoria'), auditoriaController.getAuditoriaById);
router.post('/', authMiddleware, permissionsMiddleware('Ver Auditoria'), auditoriaController.createAuditoria);
router.put('/:id', authMiddleware, permissionsMiddleware('Ver Auditoria'), auditoriaController.updateAuditoria);
router.delete('/:id', authMiddleware, permissionsMiddleware('Ver Auditoria'), auditoriaController.deleteAuditoria);

module.exports = router;
