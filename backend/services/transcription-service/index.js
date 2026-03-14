const express = require('express');
const path = require('path');
require('dotenv').config({ path: '../../config/.env' });
const { connectMongo } = require('./db/connection');
const transcriptionRoutes = require('./routes/transcriptionRoutes');

const app = express();
const PORT = process.env.TRANSCRIPTION_SERVICE_PORT || 3002;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rotas
app.use('/transcricao', transcriptionRoutes);

// Inicialização
const startServer = async () => {
    try {
        // Conecta ao MongoDB (Mongoose)
        await connectMongo();

        app.listen(PORT, () => {
            console.log(`Transcription Service rodando na porta ${PORT}`);
        });
    } catch (error) {
        console.error('Falha ao iniciar o serviço:', error);
        process.exit(1);
    }
};

startServer();