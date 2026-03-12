const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const transcriptionController = require('../controllers/transcriptionController');

// Configuração do Multer para salvar arquivos temporariamente
const uploadDir = path.join(__dirname, '../uploads/');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// POST /transcricao — Upload de áudio + transcrição
router.post('/', upload.single('audio'), transcriptionController.createTranscription);

// GET /transcricao/:id — Busca áudio + transcrição
router.get('/:id', transcriptionController.getTranscription);

module.exports = router;