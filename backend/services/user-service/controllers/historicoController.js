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
                res.status(404).json({ message: 'Historico não encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    createHistorico: async (req, res) => {
        try {
            const newHistorico = await Historico.create(req.body);
            res.status(201).json(newHistorico);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateHistorico: async (req, res) => {
        try {
            const updated = await Historico.update(req.params.id, req.body);
            if (updated) {
                res.json({ message: 'Historico atualizado' });
            } else {
                res.status(404).json({ message: 'Historico não encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deleteHistorico: async (req, res) => {
        try {
            const deleted = await Historico.delete(req.params.id);
            if (deleted) {
                res.json({ message: 'Historico deletado' });
            } else {
                res.status(404).json({ message: 'Historico não encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = historicoController;
