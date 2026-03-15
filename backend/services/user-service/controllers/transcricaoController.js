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

    getTranscricaoByAudioId: async (req, res) => {
        try {
            const transcricao = await Transcricao.getByAudioId(req.params.audioId);
            if (transcricao) {
                res.json(transcricao);
            } else {
                res.status(404).json({ message: 'Transcrição não encontrada para este áudio' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateTranscricao: async (req, res) => {
        try {
            const Audio = require('../models/audioModel');
            const transcricao = await Transcricao.getById(req.params.id);
            if (!transcricao) return res.status(404).json({ message: 'Transcricao não encontrada' });

            const audio = await Audio.getById(transcricao.audios_idaudios);
            if (audio && audio.usuarios_idusuarios !== req.usuario.idusuarios) {
                return res.status(403).json({ message: 'Sem permissão para alterar esta transcrição' });
            }

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
            const Audio = require('../models/audioModel');
            const transcricao = await Transcricao.getById(req.params.id);
            if (!transcricao) return res.status(404).json({ message: 'Transcricao não encontrada' });

            const audio = await Audio.getById(transcricao.audios_idaudios);
            if (audio && audio.usuarios_idusuarios !== req.usuario.idusuarios) {
                return res.status(403).json({ message: 'Sem permissão para deletar esta transcrição' });
            }

            const deleted = await Transcricao.delete(req.params.id);
            if (deleted) {
                res.json({ message: 'Transcricao deletada' });
            } else {
                res.status(404).json({ message: 'Transcricao não encontrada' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deleteTranscricaoByAudioId: async (req, res) => {
        try {
            const Audio = require('../models/audioModel');
            const audio = await Audio.getById(req.params.audioId);
            if (audio && audio.usuarios_idusuarios !== req.usuario.idusuarios) {
                return res.status(403).json({ message: 'Sem permissão para deletar transcrições deste áudio' });
            }

            const deleted = await Transcricao.deleteByAudioId(req.params.audioId);
            if (deleted) {
                res.json({ message: 'Transcrição deletada com sucesso' });
            } else {
                res.status(200).json({ message: 'Nenhuma transcrição para deletar' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = transcricaoController;
