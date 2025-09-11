const Instituicao = require('../models/instituicaoModel');

const instituicaoController = {
    getAllInstituicaos: async (req, res) => {
        try {
            const instituicaos = await Instituicao.getAll();
            res.json(instituicaos);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getInstituicaoById: async (req, res) => {
        try {
            const instituicao = await Instituicao.getById(req.params.id);
            if (instituicao) {
                res.json(instituicao);
            } else {
                res.status(404).json({ message: 'Instituicao não encontrada' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    createInstituicao: async (req, res) => {
        try {
            const newInstituicao = await Instituicao.create(req.body);
            res.status(201).json(newInstituicao);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateInstituicao: async (req, res) => {
        try {
            const updated = await Instituicao.update(req.params.id, req.body);
            if (updated) {
                res.json({ message: 'Instituicao atualizada' });
            } else {
                res.status(404).json({ message: 'Instituicao não encontrada' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deleteInstituicao: async (req, res) => {
        try {
            const deleted = await Instituicao.delete(req.params.id);
            if (deleted) {
                res.json({ message: 'Instituicao deletada' });
            } else {
                res.status(404).json({ message: 'Instituicao não encontrada' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = instituicaoController;
