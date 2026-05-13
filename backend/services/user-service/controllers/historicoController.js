const Historico = require('../models/historicoModel');

const historicoController = {
    getAllHistoricos: async (req, res) => {
        try {
            const historicos = await Historico.getAll();
            res.json(historicos);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getHistoricoById: async (req, res) => {
        try {
            const historico = await Historico.getById(req.params.id);
            if (historico) {
                res.json(historico);
            } else {
                res.status(404).json({ message: 'Histórico não encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getHistoricoByUsuarioId: async (req, res) => {
        try {
            const historico = await Historico.getByUsuarioId(req.usuario.idusuarios);
            res.json(historico);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getHistoricoByAudio: async (req, res) => {
        try {
            const historico = await Historico.getByUsuarioAndAudio(req.usuario.idusuarios, req.params.audioId);
            if (historico) {
                res.json(historico);
            } else {
                res.status(404).json({ message: 'Histórico não encontrado para este áudio' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    saveHistorico: async (req, res) => {
        try {
            const result = await Historico.upsert({
                ...req.body,
                usuarios_idusuarios: req.usuario.idusuarios
            });
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    createHistorico: async (req, res) => {
        try {
            const novoHistorico = await Historico.create({
                ...req.body,
                usuarios_idusuarios: req.usuario.idusuarios
            });
            res.status(201).json(novoHistorico);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateHistorico: async (req, res) => {
        try {
            const existing = await Historico.getById(req.params.id);
            if (!existing) return res.status(404).json({ message: 'Histórico não encontrado' });
            if (existing.usuarios_idusuarios !== req.usuario.idusuarios) {
                return res.status(403).json({ message: 'Sem permissão para alterar este histórico' });
            }

            const atualizado = await Historico.update(req.params.id, {
                ...req.body,
                usuarios_idusuarios: req.usuario.idusuarios
            });
            if (atualizado) {
                res.json({ message: 'Histórico atualizado' });
            } else {
                res.status(404).json({ message: 'Histórico não encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deleteHistorico: async (req, res) => {
        try {
            const existing = await Historico.getById(req.params.id);
            if (!existing) return res.status(404).json({ message: 'Histórico não encontrado' });
            if (existing.usuarios_idusuarios !== req.usuario.idusuarios) {
                return res.status(403).json({ message: 'Sem permissão para deletar este histórico' });
            }

            const deletado = await Historico.delete(req.params.id);
            if (deletado) {
                res.json({ message: 'Histórico deletado' });
            } else {
                res.status(404).json({ message: 'Histórico não encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = historicoController;
