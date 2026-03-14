require('dotenv').config({ path: '../../config/.env' });
const fs = require('fs');
const path = require('path');
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
    usuarios_idusuarios = 1,
    idiomas_ididiomas,
    imagens_idimagens
}) {
    // 1. Cria registro na tabela 'audios' via user-service
    
    const payload = {
        usuarios_idusuarios,
        visualizacoes: 0,
        titulo: titulo || 'Sem título',
        descricao: descricao || ''
    };
    if (temas_idtemas) payload.temas_idtemas = temas_idtemas;
    if (idiomas_ididiomas) payload.idiomas_ididiomas = idiomas_ididiomas;
    if (imagens_idimagens) payload.imagens_idimagens = imagens_idimagens;

    const audioResponse = await fetch(`${USER_SERVICE_URL}/audios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!audioResponse.ok) {
        const err = await audioResponse.json();
        throw new Error(`Erro ao criar áudio no user-service: ${err.message || audioResponse.statusText}`);
    }

    const audioData = await audioResponse.json();
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
}

/**
 * Salva a transcrição no MySQL (via user-service) para um áudio já existente.
 * Chamado APÓS o Whisper finalizar.
 */
async function saveTranscription({ audioId, textoTranscricao, idiomas_ididiomas = 1 }) {
    const transcricaoResponse = await fetch(`${USER_SERVICE_URL}/transcricoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            textoTranscricao,
            audios_idaudios: audioId,
            idiomas_ididiomas
        })
    });

    if (!transcricaoResponse.ok) {
        const err = await transcricaoResponse.json();
        throw new Error(`Erro ao salvar transcrição: ${err.message || transcricaoResponse.statusText}`);
    }

    console.log(`Transcrição salva para áudio ID: ${audioId}`);
}

/**
 * Busca o áudio (MongoDB GridFS) e a transcrição (MySQL via user-service) pelo ID do áudio.
 */
async function getAudioWithTranscription(audioId) {
        try {
            // 1. Busca dados do MySQL (user-service) COM DETALHES (JOIN)
            const audioResponse = await fetch(`${USER_SERVICE_URL}/audios/${audioId}/details`);
            if (!audioResponse.ok) {
                if (audioResponse.status === 404) return null;
                throw new Error(`Erro ao buscar áudio no user-service: ${audioResponse.statusText}`);
            }
            const audioData = await audioResponse.json();

            // 2. Busca transcrição via user-service
            const transcricaoResponse = await fetch(`${USER_SERVICE_URL}/transcricoes/audio/${audioId}`);
            let transcricao = null;
            if (transcricaoResponse.ok) {
                transcricao = await transcricaoResponse.json();
            }

            // 3. Busca o áudio original no GridFS (se existir transcrição ou se estivermos buscando para tocar logo)
            const audioMongo = await AudioMongo.findOne({ mysqlAudioId: audioId }).lean();
            let hasAudio = false;

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
                transcricao: transcricao ? {
                    texto: transcricao.textoTranscricao,
                    idioma: transcricao.idiomas_ididiomas
                } : null,
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
async function deleteAudioRecord(audioId) {
    try {
        console.log(`Iniciando deleção do áudio ID: ${audioId}`);
        
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
        const transcricaoResponse = await fetch(`${USER_SERVICE_URL}/transcricoes/audio/${audioId}`, {
            method: 'DELETE'
        });
        if (!transcricaoResponse.ok) {
            console.warn(`Aviso: Falha ao deletar transcrições no MySQL. HTTP Status: ${transcricaoResponse.status}`);
        } else {
            console.log(`Transcrições deletadas no MySQL para audioId: ${audioId}`);
        }

        // 3. Deletar o registro de áudio no MySQL via user-service
        const audioResponse = await fetch(`${USER_SERVICE_URL}/audios/${audioId}`, {
            method: 'DELETE'
        });
        if (!audioResponse.ok && audioResponse.status !== 404) {
            const err = await audioResponse.json();
            throw new Error(`Erro ao deletar áudio pai no user-service: ${err.message || audioResponse.statusText}`);
        }
        
        console.log(`Áudio deletado com sucesso do MySQL. ID: ${audioId}`);
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
