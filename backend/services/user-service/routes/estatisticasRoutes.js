const express = require('express');
const router = express.Router();
const estatisticasController = require('../controllers/estatisticasController');
const authMiddleware = require('../middleware/authMiddleware');
const permissionsMiddleware = require('../middleware/permissionsMiddleware');

router.get('/', authMiddleware, permissionsMiddleware('Ver Auditoria'), estatisticasController.getStats);

module.exports = router;
