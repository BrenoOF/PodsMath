const NivelAcesso = require('../models/nivelAcessoModel');

const nivelAcessoController = {
    getAllNivelAcessos: async (req, res) => {
        try {
            const nivelAcessos = await NivelAcesso.getAll();
            res.json(nivelAcessos);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getNivelAcessoById: async (req, res) => {
        try {
            const nivelAcesso = await NivelAcesso.getById(req.params.id);
            if (nivelAcesso) {
                res.json(nivelAcesso);
            } else {
                res.status(404).json({ message: 'NivelAcesso não encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    createNivelAcesso: async (req, res) => {
        try {
            const newNivelAcesso = await NivelAcesso.create(req.body);
            res.status(201).json(newNivelAcesso);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateNivelAcesso: async (req, res) => {
        try {
            const updated = await NivelAcesso.update(req.params.id, req.body);
            if (updated) {
                res.json({ message: 'NivelAcesso atualizado' });
            } else {
                res.status(404).json({ message: 'NivelAcesso não encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deleteNivelAcesso: async (req, res) => {
        try {
            const deleted = await NivelAcesso.delete(req.params.id);
            if (deleted) {
                res.json({ message: 'NivelAcesso deletado' });
            } else {
                res.status(404).json({ message: 'NivelAcesso não encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = nivelAcessoController;
