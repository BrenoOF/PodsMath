const Tema = require('../models/temaModel');

const temaController = {
    getAllTemas: async (req, res) => {
        try {
            const temas = await Tema.getAll();
            res.json(temas);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getTemaById: async (req, res) => {
        try {
            const tema = await Tema.getById(req.params.id);
            if (tema) {
                res.json(tema);
            } else {
                res.status(404).json({ message: 'Tema não encontrada' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    createTema: async (req, res) => {
        try {
            const newTema = await Tema.create(req.body);
            res.status(201).json(newTema);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateTema: async (req, res) => {
        try {
            const updated = await Tema.update(req.params.id, req.body);
            if (updated) {
                res.json({ message: 'Tema atualizada' });
            } else {
                res.status(404).json({ message: 'Tema não encontrada' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deleteTema: async (req, res) => {
        try {
            const deleted = await Tema.delete(req.params.id);
            if (deleted) {
                res.json({ message: 'Tema deletada' });
            } else {
                res.status(404).json({ message: 'Tema não encontrada' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = temaController;
