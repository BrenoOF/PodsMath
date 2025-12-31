const queueService = require('../services/queueService');

const transcriptionController = {
    createTranscription: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'Nenhum arquivo de áudio enviado.' });
            }

            const { id } = req.body;
            
            if (!id) {
                return res.status(400).json({ message: 'ID é obrigatório.' });
            }

            // O caminho do arquivo salvo pelo multer
            const filePath = req.file.path;

            // Adiciona à fila de processamento
            queueService.addToQueue(filePath, id);

            // Responde imediatamente ao cliente confirmando o recebimento
            res.status(202).json({
                message: 'Áudio recebido e adicionado à fila de transcrição.',
                id: id,
                status: 'queued'
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro interno ao processar solicitação.' });
        }
    }
};

module.exports = transcriptionController;