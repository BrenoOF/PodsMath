const express = require('express');
const { connectToDatabase } = require('./db/connection');
const transcriptionRoutes = require('./routes/transcriptionRoutes');

const app = express();
const PORT = 3002;

app.use(express.json());

// Rotas
app.use('/transcricao', transcriptionRoutes);

// Inicialização
const startServer = async () => {
    try {
        await connectToDatabase();
        
        app.listen(PORT, () => {
            console.log(`Transcription Service rodando na porta ${PORT}`);
        });
    } catch (error) {
        console.error('Falha ao iniciar o serviço:', error);
        process.exit(1);
    }
};

startServer();