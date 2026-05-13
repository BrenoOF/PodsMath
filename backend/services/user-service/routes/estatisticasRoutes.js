const express = require('express');
const router = express.Router();
const estatisticasController = require('../controllers/estatisticasController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, estatisticasController.getStats);

module.exports = router;
