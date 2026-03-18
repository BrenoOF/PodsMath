const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const queueService = require('../services/queueService');
const { createAudioRecord, getAudioWithTranscription } = require('../services/audioService');

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3001';

const transcriptionController = {
    /**
     * POST /transcricao
     * 1. Se houver imagem, faz upload para o user-service para pegar o ID
     * 2. Cria o áudio no MySQL + MongoDB imediatamente
     * 3. Coloca na fila do Whisper
     * 4. Retorna o audioId + status 'queued'
     */
    createTranscription: async (req, res) => {
        try {
            const audioFile = req.files?.audio?.[0];
            const imagemFile = req.files?.imagem?.[0];

            if (!audioFile) {
                return res.status(400).json({ message: 'Nenhum arquivo de áudio enviado.' });
            }

            let {
                titulo = 'Sem título',
                descricao = '',
                temas_idtemas = 1,
                idiomas_ididiomas = 1,
                imagens_idimagens = 1
            } = req.body;

            let token = req.headers.authorization?.split(' ')[1] || req.query.token;
            if (token === 'null' || token === 'undefined') token = null;

            // 1. Se enviou imagem, faz o "forward" para o user-service
            if (imagemFile) {
                try {
                    const form = new FormData();
                    form.append('imagem', fs.createReadStream(imagemFile.path));
                    
                    const userServRes = await axios.post(`${USER_SERVICE_URL}/imagens`, form, {
                        headers: {
                            ...form.getHeaders(),
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    
                    if (userServRes.data && userServRes.data.idimagens) {
                        imagens_idimagens = userServRes.data.idimagens;
                    }
                } catch (imgErr) {
                    console.error('Erro ao enviar imagem para user-service:', imgErr.message);
                } finally {
                    // Limpa o arquivo temporário da imagem no transcription-service
                    if (fs.existsSync(imagemFile.path)) {
                        try { fs.unlinkSync(imagemFile.path); } catch (e) { console.error('Falha ao deletar imagem temporária:', e); }
                    }
                }
            }

            const usuarios_idusuarios = req.usuario.idusuarios;

            const filePath = audioFile.path;
            const mimeType = audioFile.mimetype || 'audio/wav';

            // 2. Cria o áudio no MySQL e salva buffer no MongoDB AGORA
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

            // 3. Adiciona à fila do Whisper (transcrição será salva depois)
            queueService.addToQueue(filePath, audioId, idiomas_ididiomas, token);

            res.status(202).json({
                message: 'Áudio criado e adicionado à fila de transcrição.',
                audioId,
                status: 'queued',
                imagens_idimagens
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
            let token = req.headers.authorization?.split(' ')[1] || req.query.token;

            if (token === 'null' || token === 'undefined') {
                token = null;
            }

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

            // Verifica se tem transcrições
            const hasTranscription = Array.isArray(result.transcricoes) && result.transcricoes.length > 0;

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
                transcricoes: result.transcricoes || []
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
            let token = req.headers.authorization?.split(' ')[1] || req.query.token;
            if (token === 'null' || token === 'undefined') token = null;

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