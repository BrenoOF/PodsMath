const { nodewhisper } = require('nodejs-whisper');
const fs = require('fs');
const path = require('path');
const { saveTranscription } = require('./audioService');

// Fila em memória
const queue = [];
let isProcessing = false;

// Status de cada job por audioId
const jobStatus = new Map();

// Histórico de velocidade de processamento para estimar tempo
// Armazena a razão: tempo_processamento_ms / tamanho_arquivo_bytes
const processingHistory = [];
const DEFAULT_RATIO = 0.003; // fallback: ~3ms por byte (estimativa conservadora)

function getAvgRatio() {
    if (processingHistory.length === 0) return DEFAULT_RATIO;
    const sum = processingHistory.reduce((a, b) => a + b, 0);
    return sum / processingHistory.length;
}

const queueService = {
    /**
     * Adiciona à fila de transcrição. O áudio já deve existir no MySQL/MongoDB.
     */
    addToQueue: (filePath, audioId, idiomas_ididiomas) => {
        const position = queue.length + 1;
        let fileSizeBytes = 0;
        try { fileSizeBytes = fs.statSync(filePath).size; } catch {}

        const estimatedMs = Math.round(fileSizeBytes * getAvgRatio());

        jobStatus.set(String(audioId), {
            status: 'queued',
            position,
            fileSizeBytes,
            estimatedMs: estimatedMs > 0 ? estimatedMs : null,
            queuedAt: new Date().toISOString()
        });
        queue.push({ filePath, audioId, idiomas_ididiomas, fileSizeBytes });
        console.log(`Áudio ID ${audioId} adicionado à fila. Posição: ${position}. Tamanho: ${(fileSizeBytes / 1024).toFixed(0)}KB`);
        queueService.processQueue();
    },

    /**
     * Retorna o status atual de um job pelo audioId, com estimativa de tempo.
     */
    getStatus: (audioId) => {
        const job = jobStatus.get(String(audioId));
        if (!job) return null;

        // Calcula tempo restante estimado quando transcrevendo
        if (job.status === 'transcribing' && job.startedAt) {
            const elapsedMs = Date.now() - new Date(job.startedAt).getTime();
            const estimatedTotalMs = job.estimatedMs || Math.round((job.fileSizeBytes || 0) * getAvgRatio());

            if (estimatedTotalMs > 0) {
                const remainingMs = Math.max(0, estimatedTotalMs - elapsedMs);
                const progressPercent = Math.min(99, Math.round((elapsedMs / estimatedTotalMs) * 100));
                return {
                    ...job,
                    elapsedMs,
                    estimatedTotalMs,
                    estimatedRemainingMs: remainingMs,
                    estimatedRemainingSec: Math.ceil(remainingMs / 1000),
                    progressPercent
                };
            }
        }

        return job;
    },

    /**
     * Processa a fila sequencialmente.
     */
    processQueue: async () => {
        if (isProcessing || queue.length === 0) {
            return;
        }

        isProcessing = true;
        const task = queue.shift();
        const audioIdStr = String(task.audioId);

        // Atualiza posições dos jobs restantes na fila
        queue.forEach((item, i) => {
            const s = jobStatus.get(String(item.audioId));
            if (s) s.position = i + 1;
        });

        const transcribeStartTime = Date.now();

        try {
            // --- TRANSCRIBING ---
            const estimatedMs = Math.round((task.fileSizeBytes || 0) * getAvgRatio());
            jobStatus.set(audioIdStr, {
                status: 'transcribing',
                fileSizeBytes: task.fileSizeBytes,
                estimatedMs: estimatedMs > 0 ? estimatedMs : null,
                startedAt: new Date().toISOString()
            });
            console.log(`Iniciando transcrição para áudio ID: ${task.audioId}`);

            const absolutePath = path.resolve(task.filePath);

            if (!fs.existsSync(absolutePath)) {
                throw new Error(`Arquivo não encontrado: ${absolutePath}`);
            }

            await nodewhisper(absolutePath, {
                modelName: 'base',
                autoDownloadModelName: 'base',
                removeWavFileAfterTranscription: false,
                withCuda: false,
                whisperOptions: {
                    outputInJson: true,
                    language: 'auto'
                }
            });

            // Registra velocidade real de processamento
            const transcribeTimeMs = Date.now() - transcribeStartTime;
            if (task.fileSizeBytes > 0) {
                const ratio = transcribeTimeMs / task.fileSizeBytes;
                processingHistory.push(ratio);
                // Mantém apenas os últimos 10 registros
                if (processingHistory.length > 10) processingHistory.shift();
                console.log(`Ratio real: ${ratio.toFixed(4)} ms/byte (${(transcribeTimeMs / 1000).toFixed(1)}s para ${(task.fileSizeBytes / 1024).toFixed(0)}KB)`);
            }

            // Localiza o JSON gerado pelo Whisper
            const ext = path.extname(absolutePath);
            const wavPath = absolutePath.replace(ext, '.wav');
            const jsonPath = [
                absolutePath + '.json',
                absolutePath.replace(ext, '.json'),
                wavPath + '.json',
                wavPath.replace('.wav', '.json')
            ].find(p => fs.existsSync(p));

            let textoTranscricao = '';

            if (jsonPath) {
                const transcriptData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
                textoTranscricao = Array.isArray(transcriptData.transcription)
                    ? transcriptData.transcription.map(s => s.text.trim()).join('\n')
                    : (transcriptData.text || '');
                fs.unlinkSync(jsonPath);
            } else {
                console.warn('JSON da transcrição não encontrado para:', absolutePath);
            }

            // --- SAVING ---
            jobStatus.set(audioIdStr, {
                status: 'saving',
                startedAt: new Date().toISOString()
            });
            console.log(`Transcrição concluída. Salvando no banco...`);

            await saveTranscription({
                audioId: task.audioId,
                textoTranscricao,
                idiomas_ididiomas: task.idiomas_ididiomas
            });

            // --- COMPLETED ---
            jobStatus.set(audioIdStr, {
                status: 'completed',
                completedAt: new Date().toISOString()
            });
            console.log(`Áudio ID ${task.audioId} processado com sucesso.`);

            // Remove arquivos temporários (original + WAV convertido)
            if (fs.existsSync(absolutePath)) fs.unlinkSync(absolutePath);
            if (ext !== '.wav' && fs.existsSync(wavPath)) fs.unlinkSync(wavPath);

        } catch (error) {
            console.error(`Erro ao processar áudio ID ${task.audioId}:`, error);
            jobStatus.set(audioIdStr, {
                status: 'error',
                error: error.message,
                failedAt: new Date().toISOString()
            });
        } finally {
            isProcessing = false;
            queueService.processQueue();
        }
    }
};

module.exports = queueService;