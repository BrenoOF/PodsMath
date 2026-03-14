require('dotenv').config({ path: '../../config/.env' });
const mongoose = require('mongoose');

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/podsmath';

let gridFSBucket;

async function connectMongo() {
    try {
        await mongoose.connect(mongoUri);
        
        // Inicializa o GridFSBucket após a conexão
        gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: 'audios'
        });
        
        console.log('Conectado ao MongoDB (Mongoose) no serviço de transcrição');
        console.log('GridFSBucket inicializado para upload de áudios.');
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error);
        throw error;
    }
}

function getGridFSBucket() {
    if (!gridFSBucket) {
        throw new Error('GridFSBucket não inicializado.');
    }
    return gridFSBucket;
}

module.exports = { connectMongo, getGridFSBucket };