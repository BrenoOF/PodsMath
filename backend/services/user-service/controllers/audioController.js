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

    getAudioDetailsById: async (req, res) => {
        try {
            const audio = await Audio.getDetailsById(req.params.id);
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
            const newAudio = await Audio.create({
                ...req.body,
                usuarios_idusuarios: req.usuario.idusuarios
            });
            res.status(201).json(newAudio);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateAudio: async (req, res) => {
        try {
            const existing = await Audio.getById(req.params.id);
            if (!existing) return res.status(404).json({ message: 'Audio não encontrado' });
            if (existing.usuarios_idusuarios !== req.usuario.idusuarios) {
                return res.status(403).json({ message: 'Sem permissão para alterar este áudio' });
            }

            const updated = await Audio.update(req.params.id, {
                ...req.body,
                usuarios_idusuarios: req.usuario.idusuarios
            });
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
            const existing = await Audio.getById(req.params.id);
            if (!existing) return res.status(404).json({ message: 'Audio não encontrado' });
            if (existing.usuarios_idusuarios !== req.usuario.idusuarios) {
                return res.status(403).json({ message: 'Sem permissão para deletar este áudio' });
            }

            const deleted = await Audio.delete(req.params.id);
            if (deleted) {
                res.json({ message: 'Audio deletado' });
            } else {
                res.status(404).json({ message: 'Audio não encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getHighlights: async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const audios = await Audio.getHighlights(limit);
            res.json(audios);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getRecent: async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const audios = await Audio.getRecent(limit);
            res.json(audios);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getOwnAudios: async (req, res) => {
        try {
            const userId = req.usuario.idusuarios;
            const audios = await Audio.getByUser(userId);
            res.json(audios);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = audioController;
