require('dotenv').config({ path: '../../config/.env' });
const { MongoClient } = require('mongodb');

// URL de conexão padrão ou via variável de ambiente
const url = process.env.MONGO_URI || 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'podsmath_transcriptions';

let db = null;

async function connectToDatabase() {
    try {
        if (db) return db;
        await client.connect();
        console.log('Conectado ao MongoDB no serviço de transcrição');
        db = client.db(dbName);
        return db;
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error);
        throw error;
    }
}

function getDb() {
    return db;
}

module.exports = { connectToDatabase, getDb };