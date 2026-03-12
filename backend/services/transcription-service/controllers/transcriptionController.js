const queueService = require('../services/queueService');
const { createAudioRecord, getAudioWithTranscription } = require('../services/audioService');

const transcriptionController = {
    /**
     * POST /transcricao
     * 1. Cria o áudio no MySQL + MongoDB imediatamente
     * 2. Coloca na fila do Whisper
     * 3. Retorna o audioId + status 'queued'
     */
    createTranscription: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'Nenhum arquivo de áudio enviado.' });
            }

            const {
                titulo = 'Sem título',
                descricao = '',
                temas_idtemas = 1,
                usuarios_idusuarios = 1,
                idiomas_ididiomas = 1,
                imagens_idimagens = 1
            } = req.body;

            const filePath = req.file.path;
            const mimeType = req.file.mimetype || 'audio/wav';

            // 1. Cria o áudio no MySQL e salva buffer no MongoDB AGORA
            const audioId = await createAudioRecord({
                filePath,
                mimeType,
                titulo,
                descricao,
                temas_idtemas,
                usuarios_idusuarios,
                idiomas_ididiomas,
                imagens_idimagens
            });

            // 2. Adiciona à fila do Whisper (transcrição será salva depois)
            queueService.addToQueue(filePath, audioId, idiomas_ididiomas);

            res.status(202).json({
                message: 'Áudio criado e adicionado à fila de transcrição.',
                audioId,
                status: 'queued'
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro interno ao processar solicitação.' });
        }
    },

    /**
     * GET /transcricao/:id
     * Retorna o status do processamento ou o resultado completo se já finalizado.
     */
    getTranscription: async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ message: 'ID é obrigatório.' });
            }

            // 1. Verifica status in-memory (fila/processamento)
            const jobInfo = queueService.getStatus(id);

            if (jobInfo && jobInfo.status !== 'completed') {
                // Ainda processando
                return res.json({
                    audioId: parseInt(id),
                    status: jobInfo.status,
                    ...(jobInfo.position !== undefined && { posicaoFila: jobInfo.position }),
                    ...(jobInfo.progressPercent !== undefined && { progressPercent: jobInfo.progressPercent }),
                    ...(jobInfo.estimatedRemainingSec !== undefined && { estimatedRemainingSec: jobInfo.estimatedRemainingSec }),
                    ...(jobInfo.elapsedMs !== undefined && { elapsedMs: jobInfo.elapsedMs }),
                    ...(jobInfo.error && { error: jobInfo.error }),
                    ...(jobInfo.queuedAt && { queuedAt: jobInfo.queuedAt }),
                    ...(jobInfo.startedAt && { startedAt: jobInfo.startedAt }),
                    ...(jobInfo.failedAt && { failedAt: jobInfo.failedAt })
                });
            }

            // 2. Completo ou não está na fila → busca no banco
            const result = await getAudioWithTranscription(id);

            if (!result) {
                return res.status(404).json({ message: 'Áudio não encontrado.' });
            }

            // Verifica se tem transcrição (registro existe no banco)
            const hasTranscription = result.transcricao != null && result.transcricao.texto != null;

            const response = {
                audioId: result.id,
                status: hasTranscription ? 'completed' : 'processing',
                titulo: result.titulo,
                descricao: result.descricao,
                visualizacoes: result.visualizacoes,
                ...(hasTranscription && {
                    transcricao: result.transcricao,
                    audio: result.audio ? {
                        mimeType: result.audio.mimeType,
                        base64: result.audio.buffer.toString('base64'),
                        dataUrl: `data:${result.audio.mimeType};base64,${result.audio.buffer.toString('base64')}`
                    } : null
                })
            };

            res.json(response);

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro interno ao buscar transcrição.' });
        }
    }
};

module.exports = transcriptionController;