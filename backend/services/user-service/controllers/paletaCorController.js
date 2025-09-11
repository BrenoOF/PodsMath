const PaletaCor = require('../models/paletaCorModel');

const paletaCorController = {
    getAllPaletaCors: async (req, res) => {
        try {
            const paletaCors = await PaletaCor.getAll();
            res.json(paletaCors);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getPaletaCorById: async (req, res) => {
        try {
            const paletaCor = await PaletaCor.getById(req.params.id);
            if (paletaCor) {
                res.json(paletaCor);
            } else {
                res.status(404).json({ message: 'PaletaCor não encontrada' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    createPaletaCor: async (req, res) => {
        try {
            const newPaletaCor = await PaletaCor.create(req.body);
            res.status(201).json(newPaletaCor);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updatePaletaCor: async (req, res) => {
        try {
            const updated = await PaletaCor.update(req.params.id, req.body);
            if (updated) {
                res.json({ message: 'PaletaCor atualizada' });
            } else {
                res.status(404).json({ message: 'PaletaCor não encontrada' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deletePaletaCor: async (req, res) => {
        try {
            const deleted = await PaletaCor.delete(req.params.id);
            if (deleted) {
                res.json({ message: 'PaletaCor deletada' });
            } else {
                res.status(404).json({ message: 'PaletaCor não encontrada' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = paletaCorController;
