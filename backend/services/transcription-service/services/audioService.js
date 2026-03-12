const fs = require('fs');
const AudioMongo = require('../models/AudioMongo');

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3001';

/**
 * Cria o registro do áudio no MySQL (via user-service) e salva o buffer no MongoDB.
 * Chamado ANTES da transcrição, para que o audioId já exista.
 */
async function createAudioRecord({
    filePath,
    mimeType,
    titulo,
    descricao,
    temas_idtemas = 1,
    usuarios_idusuarios = 1,
    idiomas_ididiomas = 1,
    imagens_idimagens = 1
}) {
    // 1. Cria registro na tabela 'audios' via user-service
    const audioResponse = await fetch(`${USER_SERVICE_URL}/audios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            temas_idtemas,
            usuarios_idusuarios,
            imagens_idimagens,
            visualizacoes: 0,
            titulo,
            descricao,
            idiomas_ididiomas
        })
    });

    if (!audioResponse.ok) {
        const err = await audioResponse.json();
        throw new Error(`Erro ao criar áudio no user-service: ${err.message || audioResponse.statusText}`);
    }

    const audioData = await audioResponse.json();
    const audioId = audioData.idaudios;

    // 2. Salva o buffer do áudio no MongoDB
    const audioBuffer = fs.readFileSync(filePath);
    await AudioMongo.create({
        mysqlAudioId: audioId,
        audioBuffer,
        mimeType: mimeType || 'audio/wav'
    });

    console.log(`Áudio pré-criado. MySQL ID: ${audioId}`);
    return audioId;
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
 * Busca o áudio (MongoDB) e a transcrição (MySQL via user-service) pelo ID do áudio.
 */
async function getAudioWithTranscription(audioId) {
    // 1. Busca metadados do áudio via user-service
    const audioResponse = await fetch(`${USER_SERVICE_URL}/audios/${audioId}`);
    
    if (!audioResponse.ok) {
        if (audioResponse.status === 404) return null;
        const err = await audioResponse.json();
        throw new Error(`Erro ao buscar áudio: ${err.message || audioResponse.statusText}`);
    }

    const metadata = await audioResponse.json();

    // 2. Busca transcrição via user-service
    const transcricaoResponse = await fetch(`${USER_SERVICE_URL}/transcricoes/audio/${audioId}`);
    let transcricao = null;
    
    if (transcricaoResponse.ok) {
        transcricao = await transcricaoResponse.json();
    }

    // 3. Busca o áudio binário no MongoDB
    const audioDoc = await AudioMongo.findOne({ mysqlAudioId: parseInt(audioId) });

    return {
        id: metadata.idaudios,
        titulo: metadata.titulo,
        descricao: metadata.descricao,
        visualizacoes: metadata.visualizacoes,
        temas_idtemas: metadata.temas_idtemas,
        usuarios_idusuarios: metadata.usuarios_idusuarios,
        idiomas_ididiomas: metadata.idiomas_ididiomas,
        transcricao: transcricao ? {
            id: transcricao.idTranscricao,
            texto: transcricao.textoTranscricao
        } : null,
        audio: audioDoc ? {
            mimeType: audioDoc.mimeType,
            buffer: audioDoc.audioBuffer
        } : null
    };
}

module.exports = { createAudioRecord, saveTranscription, getAudioWithTranscription };
