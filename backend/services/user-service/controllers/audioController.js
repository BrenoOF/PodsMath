const Audio = require('../models/audioModel');

const audioController = {
    getAllAudios: async (req, res) => {
        try {
            const audios = await Audio.getAll();
            res.json(audios);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getAudioById: async (req, res) => {
        try {
            const audio = await Audio.getById(req.params.id);
            if (audio) {
                res.json(audio);
            } else {
                res.status(404).json({ message: 'Audio não encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    createAudio: async (req, res) => {
        try {
            const newAudio = await Audio.create(req.body);
            res.status(201).json(newAudio);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateAudio: async (req, res) => {
        try {
            const updated = await Audio.update(req.params.id, req.body);
            if (updated) {
                res.json({ message: 'Audio atualizado' });
            } else {
                res.status(404).json({ message: 'Audio não encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deleteAudio: async (req, res) => {
        try {
            const deleted = await Audio.delete(req.params.id);
            if (deleted) {
                res.json({ message: 'Audio deletado' });
            } else {
                res.status(404).json({ message: 'Audio não encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = audioController;
