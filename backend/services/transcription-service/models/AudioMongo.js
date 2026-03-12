const mongoose = require('mongoose');

const AudioSchema = new mongoose.Schema({
    mysqlAudioId: {
        type: Number,
        required: true,
        index: true
    },
    audioBuffer: {
        type: Buffer,
        required: true
    },
    mimeType: {
        type: String,
        default: 'audio/wav'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('AudioMongo', AudioSchema);
