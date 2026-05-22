const Auditoria = require('../models/auditoriaModel');

const auditoriaController = {
    getAllAuditorias: async (req, res) => {
        try {
            const auditorias = await Auditoria.getAll();
            res.json(auditorias);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getAuditoriaById: async (req, res) => {
        try {
            const auditoria = await Auditoria.getById(req.params.id);
            if (auditoria) {
                res.json(auditoria);
            } else {
                res.status(404).json({ message: 'Auditoria não encontrada' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    createAuditoria: async (req, res) => {
        try {
            const newAuditoria = await Auditoria.create(req.body);
            res.status(201).json(newAuditoria);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateAuditoria: async (req, res) => {
        try {
            const updated = await Auditoria.update(req.params.id, req.body);
            if (updated) {
                res.json({ message: 'Auditoria atualizada' });
            } else {
                res.status(404).json({ message: 'Auditoria não encontrada' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deleteAuditoria: async (req, res) => {
        try {
            const deleted = await Auditoria.delete(req.params.id);
            if (deleted) {
                res.json({ message: 'Auditoria deletada' });
            } else {
                res.status(404).json({ message: 'Auditoria não encontrada' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = auditoriaController;
