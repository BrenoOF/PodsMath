const Idioma = require('../models/idiomaModel');

const idiomaController = {
    getAllIdiomas: async (req, res) => {
        try {
            const idiomas = await Idioma.getAll();
            res.json(idiomas);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getIdiomaById: async (req, res) => {
        try {
            const idioma = await Idioma.getById(req.params.id);
            if (idioma) {
                res.json(idioma);
            } else {
                res.status(404).json({ message: 'Idioma não encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    createIdioma: async (req, res) => {
        try {
            const newIdioma = await Idioma.create(req.body);
            res.status(201).json(newIdioma);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateIdioma: async (req, res) => {
        try {
            const updated = await Idioma.update(req.params.id, req.body);
            if (updated) {
                res.json({ message: 'Idioma atualizado' });
            } else {
                res.status(404).json({ message: 'Idioma não encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deleteIdioma: async (req, res) => {
        try {
            const deleted = await Idioma.delete(req.params.id);
            if (deleted) {
                res.json({ message: 'Idioma deletado' });
            } else {
                res.status(404).json({ message: 'Idioma não encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = idiomaController;
