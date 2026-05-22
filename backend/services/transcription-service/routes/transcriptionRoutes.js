const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const transcriptionController = require('../controllers/transcriptionController');
const authMiddleware = require('../middleware/authMiddleware');
const permissionsMiddleware = require('../middleware/permissionsMiddleware');

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

// POST /transcricao — Upload de áudio + imagem opcional + metadados
router.post('/', authMiddleware, permissionsMiddleware('Criar Audios'), upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'imagem', maxCount: 1 }
]), transcriptionController.createTranscription);

// GET /transcricao/status — Retorna dados de TODAS as transcrições
router.get('/status', transcriptionController.getAllTranscriptionsStatusHandler);

// GET /transcricao/:id — Busca áudio + transcrição
router.get('/:id', transcriptionController.getTranscription);

// GET /transcricao/:id/audio — Stream do áudio
router.get('/:id/audio', transcriptionController.streamAudio);

// DELETE /transcricao/:id — Deleta áudio + transcrição do MongoDB e MySQL
router.delete('/:id', authMiddleware, permissionsMiddleware('Excluir Audios'), transcriptionController.deleteTranscription);

module.exports = router;