require('dotenv').config({ path: '../../config/.env' });
const mongoose = require('mongoose');

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/podsmath';

async function connectMongo() {
    try {
        await mongoose.connect(mongoUri);
        console.log('Conectado ao MongoDB (Mongoose) no serviço de transcrição');
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error);
        throw error;
    }
}

module.exports = { connectMongo };