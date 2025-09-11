const Transcricao = require('../models/transcricaoModel');

const transcricaoController = {
    getAllTranscricaos: async (req, res) => {
        try {
            const transcricaos = await Transcricao.getAll();
            res.json(transcricaos);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getTranscricaoById: async (req, res) => {
        try {
            const transcricao = await Transcricao.getById(req.params.id);
            if (transcricao) {
                res.json(transcricao);
            } else {
                res.status(404).json({ message: 'Transcricao não encontrada' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    createTranscricao: async (req, res) => {
        try {
            const newTranscricao = await Transcricao.create(req.body);
            res.status(201).json(newTranscricao);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateTranscricao: async (req, res) => {
        try {
            const updated = await Transcricao.update(req.params.id, req.body);
            if (updated) {
                res.json({ message: 'Transcricao atualizada' });
            } else {
                res.status(404).json({ message: 'Transcricao não encontrada' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deleteTranscricao: async (req, res) => {
        try {
            const deleted = await Transcricao.delete(req.params.id);
            if (deleted) {
                res.json({ message: 'Transcricao deletada' });
            } else {
                res.status(404).json({ message: 'Transcricao não encontrada' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = transcricaoController;
