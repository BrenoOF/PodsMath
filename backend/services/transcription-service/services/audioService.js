require('dotenv').config({ path: '../../config/.env' });
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const AudioMongo = require('../models/AudioMongo');
const { getGridFSBucket } = require('../db/connection');

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3001';

/**
 * Cria o registro do áudio no MySQL (via user-service) e salva o buffer no MongoDB via GridFS.
 * Chamado ANTES da transcrição, para que o audioId já exista.
 */
async function createAudioRecord({
    filePath,
    mimeType,
    titulo,
    descricao,
    temas_idtemas,
    usuarios_idusuarios,
    idiomas_ididiomas,
    imagens_idimagens,
    token
}) {
    // 1. Cria registro na tabela 'audios' via user-service
    
    const payload = {
        visualizacoes: 0,
        titulo: titulo || 'Sem título',
        descricao: descricao || ''
    };
    if (temas_idtemas) payload.temas_idtemas = temas_idtemas;
    if (idiomas_ididiomas) payload.idiomas_ididiomas = idiomas_ididiomas;
    if (imagens_idimagens) payload.imagens_idimagens = imagens_idimagens;
    // usuarios_idusuarios removed from payload since it's from token in user-service

    try {
        const audioResponse = await axios.post(`${USER_SERVICE_URL}/audios`, payload, {
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const audioData = audioResponse.data;
        const audioId = audioData.idaudios;

        // 2. Salva o áudio no MongoDB usando GridFS (suporta arquivos > 16MB)
        const gridFSBucket = getGridFSBucket();
        const fileName = path.basename(filePath);

        const uploadStream = gridFSBucket.openUploadStream(fileName, {
            contentType: mimeType || 'audio/wav',
            metadata: { mysqlAudioId: audioId }
        });

        return new Promise((resolve, reject) => {
            const readStream = fs.createReadStream(filePath);

            readStream.pipe(uploadStream)
                .on('error', (error) => {
                    console.error(`Erro no upload para o GridFS: ${error.message}`);
                    reject(error);
                })
                .on('finish', async () => {
                    // Salva a referência no AudioMongo
                    try {
                        await AudioMongo.create({
                            mysqlAudioId: audioId,
                            fileId: uploadStream.id,
                            mimeType: mimeType || 'audio/wav'
                        });
                        console.log(`Áudio pré-criado no GridFS. MySQL ID: ${audioId}`);
                        resolve(audioId);
                    } catch (dbError) {
                        console.error(`Erro ao salvar referência no AudioMongo: ${dbError.message}`);
                        reject(dbError);
                    }
                });
        });
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        throw new Error(`Erro ao criar áudio no user-service: ${message}`);
    }
}

/**
 * Salva a transcrição no MySQL (via user-service) para um áudio já existente.
 * Chamado APÓS o Whisper finalizar.
 */
async function saveTranscription({ audioId, textoTranscricao, idiomas_ididiomas = 1, token }) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        await axios.post(`${USER_SERVICE_URL}/transcricoes`, {
            textoTranscricao,
            audios_idaudios: audioId,
            idiomas_ididiomas
        }, { headers });

        console.log(`Transcrição salva para áudio ID: ${audioId}`);
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        throw new Error(`Erro ao salvar transcrição: ${message}`);
    }
}

/**
 * Busca o áudio (MongoDB GridFS) e a transcrição (MySQL via user-service) pelo ID do áudio.
 */
async function getAudioWithTranscription(audioId, token) {
        try {
            // 1. Busca dados do MySQL (user-service) COM DETALHES (JOIN)
            let audioData;
            try {
                const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
                const audioResponse = await axios.get(`${USER_SERVICE_URL}/audios/${audioId}/details`, { headers });
                audioData = audioResponse.data;
            } catch (error) {
                if (error.response?.status === 404) return null;
                throw error;
            }

            // 2. Busca transcrição via user-service
            let transcricoes = [];
            try {
                const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
                const transcricaoResponse = await axios.get(`${USER_SERVICE_URL}/transcricoes/audio/${audioId}`, { headers });
                transcricoes = Array.isArray(transcricaoResponse.data) ? transcricaoResponse.data : [];
            } catch (error) {
                // Se não houver transcrição, continua com array vazio
            }

            // 3. Busca o áudio original no GridFS (se existir transcrição ou se estivermos buscando para tocar logo)
            const audioMongo = await AudioMongo.findOne({ mysqlAudioId: audioId }).lean();
            let hasAudio = false;
            let mimeType = 'audio/wav';

            if (audioMongo && audioMongo.fileId) {
                hasAudio = true;
                mimeType = audioMongo.mimeType || mimeType;
            }

            return {
                audioId: audioData.idaudios,
                titulo: audioData.titulo,
                descricao: audioData.descricao,
                usuario_nome: audioData.usuario_nome,
                tema_nome: audioData.tema_nome,
                idioma_nome: audioData.idioma_nome,
                imagem_caminho: audioData.imagem_caminho,
                transcricoes: transcricoes.map(t => ({
                    texto: t.textoTranscricao,
                    idioma: t.idiomas_ididiomas,
                    idioma_nome: t.idioma_nome
                })),
                hasAudio: hasAudio,
                mimeType: mimeType
            };
        } catch (error) {
            console.error('Erro em getAudioWithTranscription:', error);
            throw error;
        }
    }

/**
 * Deleta o áudio do MongoDB (GridFS e AudioMongo) e do MySQL (via user-service API).
 */
async function deleteAudioRecord(audioId, token) {
    try {
        console.log(`Iniciando deleção do áudio ID: ${audioId}`);
        
        // 0. Buscar detalhes do áudio antes de deletar para saber o ID da imagem
        let audioDetails = null;
        try {
            const detailRes = await axios.get(`${USER_SERVICE_URL}/audios/${audioId}/details`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            audioDetails = detailRes.data;
        } catch (e) {
            console.warn(`Aviso: Não foi possível buscar detalhes do áudio ${audioId} antes de deletar.`);
        }

        // 1. Deletar do MongoDB: GridFS e coleção AudioMongo
        const audioMongo = await AudioMongo.findOne({ mysqlAudioId: audioId });
        if (audioMongo) {
            if (audioMongo.fileId) {
                const gridFSBucket = getGridFSBucket();
                try {
                    await gridFSBucket.delete(audioMongo.fileId);
                    console.log(`Chunks do GridFS deletados para fileId: ${audioMongo.fileId}`);
                } catch (fsErr) {
                    console.warn(`Aviso: Arquivo GridFS não encontrado ou erro ao deletar: ${fsErr.message}`);
                }
            }
            await AudioMongo.deleteOne({ mysqlAudioId: audioId });
            console.log(`Documento AudioMongo deletado para audioId: ${audioId}`);
        }

        // 2. Deletar transcrições no MySQL via user-service
        try {
            await axios.delete(`${USER_SERVICE_URL}/transcricoes/audio/${audioId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log(`Transcrições deletadas no MySQL para audioId: ${audioId}`);
        } catch (error) {
            console.warn(`Aviso: Falha ao deletar transcrições no MySQL. Erro: ${error.message}`);
        }

        // 3. Deletar o registro de áudio no MySQL via user-service
        try {
            await axios.delete(`${USER_SERVICE_URL}/audios/${audioId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log(`Áudio deletado com sucesso do MySQL. ID: ${audioId}`);
        } catch (error) {
            if (error.response?.status !== 404) {
                const message = error.response?.data?.message || error.message;
                throw new Error(`Erro ao deletar áudio pai no user-service: ${message}`);
            }
        }

        // 4. Deletar a imagem associada se não for a padrão (ID 1)
        if (audioDetails && audioDetails.imagens_idimagens && audioDetails.imagens_idimagens !== 1) {
            try {
                await axios.delete(`${USER_SERVICE_URL}/imagens/${audioDetails.imagens_idimagens}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                console.log(`Imagem ID ${audioDetails.imagens_idimagens} deletada com sucesso.`);
            } catch (imgErr) {
                console.warn(`Aviso: Falha ao deletar imagem ID ${audioDetails.imagens_idimagens}. Erro: ${imgErr.message}`);
            }
        }
        
        return true;
    } catch (error) {
        console.error(`Erro em deleteAudioRecord:`, error);
        throw error;
    }
}

/**
 * Retorna informações do arquivo de áudio (GridFS) para streaming com Range
 */
async function getAudioFileInfo(audioId) {
    const audioMongo = await AudioMongo.findOne({ mysqlAudioId: audioId }).lean();
    if (audioMongo && audioMongo.fileId) {
        const gridFSBucket = getGridFSBucket();
        const files = await gridFSBucket.find({ _id: audioMongo.fileId }).toArray();
        if (files.length > 0) {
            return {
                fileId: audioMongo.fileId,
                mimeType: audioMongo.mimeType || 'audio/wav',
                fileSize: files[0].length
            };
        }
    }
    return null;
}

/**
 * Retorna o stream do GridFS pelo fileId
 */
function getAudioStreamById(fileId, options = {}) {
    const gridFSBucket = getGridFSBucket();
    return gridFSBucket.openDownloadStream(fileId, options);
}

module.exports = { createAudioRecord, saveTranscription, getAudioWithTranscription, deleteAudioRecord, getAudioFileInfo, getAudioStreamById };
