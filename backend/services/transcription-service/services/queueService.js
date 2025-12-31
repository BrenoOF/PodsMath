const { nodewhisper } = require('nodejs-whisper');
const fs = require('fs');
const path = require('path');
const { getDb } = require('../db/connection');

// Fila em memória simples
const queue = [];
let isProcessing = false;

const queueService = {
    // Adiciona uma tarefa à fila
    addToQueue: (filePath, externalId) => {
        queue.push({ filePath, externalId });
        console.log(`Áudio com ID ${externalId} adicionado à fila. Posição: ${queue.length}`);
        queueService.processQueue();
    },

    // Processa a fila
    processQueue: async () => {
        if (isProcessing || queue.length === 0) {
            return;
        }

        isProcessing = true;
        const task = queue.shift();

        try {
            console.log(`Iniciando transcrição para o ID: ${task.externalId}`);

            // Converte para caminho absoluto para evitar erros de "No such file" no Windows/Lib
            const absolutePath = path.resolve(task.filePath);

            // Verifica se o arquivo realmente existe antes de tentar transcrever
            if (!fs.existsSync(absolutePath)) {
                throw new Error(`Arquivo não encontrado no caminho: ${absolutePath}`);
            }

            // Executa o Whisper
            const transcription = await nodewhisper(absolutePath, {
                modelName: 'base', // Pode ser alterado para 'tiny', 'small', 'medium', 'large'
                autoDownloadModelName: 'base',
                removeWavFileAfterTranscription: false,
                withCuda: false // Mude para true se tiver GPU configurada
            });

            console.log(`Transcrição concluída para o ID: ${task.externalId}`);

            // Salva no MongoDB
            const db = getDb();
            await db.collection('transcriptions').updateOne(
                { externalId: task.externalId },
                {
                    $set: {
                        externalId: task.externalId,
                        transcription: transcription,
                        status: 'completed',
                        processedAt: new Date()
                    }
                },
                { upsert: true }
            );

            // Opcional: Remover o arquivo após processamento para economizar espaço
            // fs.unlinkSync(absolutePath); 

        } catch (error) {
            console.error(`Erro ao processar ID ${task.externalId}:`, error);
            
            const db = getDb();
            // Tenta salvar o erro no banco para auditoria
            try {
                 await db.collection('transcriptions').updateOne(
                    { externalId: task.externalId },
                    {
                        $set: {
                            status: 'error',
                            error: error.message,
                            processedAt: new Date()
                        }
                    },
                    { upsert: true }
                );
            } catch (dbError) {
                console.error('Erro ao salvar log de falha no banco:', dbError);
            }

        } finally {
            isProcessing = false;
            // Chama o próximo da fila
            queueService.processQueue();
        }
    }
};

module.exports = queueService;