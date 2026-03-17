const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// Configuração do Multer para usar memória (para processamento com sharp)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const processImage = async (req, res, next) => {
    if (!req.file) return next();

    const uploadDir = path.join(__dirname, '../uploads/images/');
    if (!fs.existsSync(uploadDir)){
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = 'img-' + uniqueSuffix + '.webp';
    const filepath = path.join(uploadDir, filename);

    try {
        await sharp(req.file.buffer)
            .webp({ quality: 80 })
            .toFile(filepath);
        
        // Adiciona informações do arquivo processado ao req
        req.processedFile = {
            filename: filename,
            path: filepath,
            relativeUrl: `images/${filename}`
        };
        next();
    } catch (error) {
        res.status(500).json({ message: 'Erro ao processar imagem: ' + error.message });
    }
};

module.exports = {
    upload,
    processImage
};
