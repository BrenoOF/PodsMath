const Imagem = require('../models/imagemModel');

const imagemController = {
    getAllImagems: async (req, res) => {
        try {
            const imagems = await Imagem.getAll();
            res.json(imagems);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getImagemById: async (req, res) => {
        try {
            const imagem = await Imagem.getById(req.params.id);
            if (imagem) {
                res.json(imagem);
            } else {
                res.status(404).json({ message: 'Imagem não encontrada' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    createImagem: async (req, res) => {
        try {
            const newImagem = await Imagem.create(req.body);
            res.status(201).json(newImagem);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateImagem: async (req, res) => {
        try {
            const updated = await Imagem.update(req.params.id, req.body);
            if (updated) {
                res.json({ message: 'Imagem atualizada' });
            } else {
                res.status(404).json({ message: 'Imagem não encontrada' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deleteImagem: async (req, res) => {
        try {
            const deleted = await Imagem.delete(req.params.id);
            if (deleted) {
                res.json({ message: 'Imagem deletada' });
            } else {
                res.status(404).json({ message: 'Imagem não encontrada' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = imagemController;
