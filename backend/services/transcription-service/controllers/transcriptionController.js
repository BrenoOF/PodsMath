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
                idiomas_ididiomas = 1,
                imagens_idimagens = 1
            } = req.body;

            const usuarios_idusuarios = req.usuario.idusuarios;
            const token = req.headers.authorization?.split(' ')[1] || req.query.token;

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
                imagens_idimagens,
                token
            });

            // 2. Adiciona à fila do Whisper (transcrição será salva depois)
            queueService.addToQueue(filePath, audioId, idiomas_ididiomas, token);

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
            const token = req.headers.authorization?.split(' ')[1] || req.query.token;

            // Tentar sempre buscar o áudio do banco para retornar logo após o upload
            const result = await getAudioWithTranscription(id, token);

            if (jobInfo && jobInfo.status !== 'completed') {
                // Ainda processando, mas retorna o áudio se já estiver no banco (GridFS)
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
                    ...(jobInfo.failedAt && { failedAt: jobInfo.failedAt }),
                    titulo: result?.titulo,
                    descricao: result?.descricao,
                    usuario_nome: result?.usuario_nome,
                    tema_nome: result?.tema_nome,
                    idioma_nome: result?.idioma_nome,
                    imagem_caminho: result?.imagem_caminho,
                    hasAudio: result?.hasAudio
                });
            }

            if (!result) {
                return res.status(404).json({ message: 'Áudio não encontrado.' });
            }

            // Verifica se tem transcrição (registro existe no banco)
            const hasTranscription = result.transcricao != null && result.transcricao.texto != null;

            const response = {
                audioId: result.audioId,
                status: hasTranscription ? 'completed' : 'processing',
                titulo: result.titulo,
                descricao: result.descricao,
                visualizacoes: result.visualizacoes,
                usuario_nome: result.usuario_nome,
                tema_nome: result.tema_nome,
                idioma_nome: result.idioma_nome,
                imagem_caminho: result.imagem_caminho,
                hasAudio: result.hasAudio,
                ...(hasTranscription && {
                    transcricao: result.transcricao
                })
            };

            res.json(response);

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro interno ao buscar transcrição.' });
        }
    },

    /**
     * DELETE /transcricao/:id
     * Deleta o áudio do MongoDB e do MySQL via user-service.
     */
    deleteTranscription: async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ message: 'ID é obrigatório.' });
            }

            const { deleteAudioRecord } = require('../services/audioService');
            const token = req.headers.authorization?.split(' ')[1] || req.query.token;
            await deleteAudioRecord(id, token);

            res.status(200).json({ message: `Vínculo de áudio ID ${id} e transcrições removidos com sucesso.` });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro interno ao deletar áudio e transcrição.' });
        }
    },

    /**
     * GET /transcricao/:id/audio
     * Realiza o stream com suporte a Range requests para permitir pular (seek) no áudio
     */
    streamAudio: async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ message: 'ID é obrigatório.' });

            const { getAudioFileInfo, getAudioStreamById } = require('../services/audioService');
            const fileInfo = await getAudioFileInfo(id);

            if (!fileInfo) {
                return res.status(404).json({ message: 'Áudio não encontrado no banco.' });
            }

            const range = req.headers.range;
            if (range) {
                const parts = range.replace(/bytes=/, '').split('-');
                const partialstart = parts[0];
                const partialend = parts[1];

                const start = parseInt(partialstart, 10);
                const end = partialend ? parseInt(partialend, 10) : fileInfo.fileSize - 1;
                const chunksize = (end - start) + 1;

                res.writeHead(206, {
                    'Content-Range': `bytes ${start}-${end}/${fileInfo.fileSize}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunksize,
                    'Content-Type': fileInfo.mimeType
                });

                // GridFS openDownloadStream options.end is EXCLUSIVE, so we add 1
                const stream = getAudioStreamById(fileInfo.fileId, { start, end: end + 1 });
                stream.pipe(res);
            } else {
                res.writeHead(200, {
                    'Content-Length': fileInfo.fileSize,
                    'Content-Type': fileInfo.mimeType
                });
                const stream = getAudioStreamById(fileInfo.fileId);
                stream.pipe(res);
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro interno ao realizar stream do áudio.' });
        }
    }
};

module.exports = transcriptionController;