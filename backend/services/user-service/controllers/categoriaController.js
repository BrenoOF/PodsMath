const Categoria = require('../models/categoriaModel');

const categoriaController = {
    getAllCategorias: async (req, res) => {
        try {
            const categorias = await Categoria.getAll();
            res.json(categorias);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getCategoriaById: async (req, res) => {
        try {
            const categoria = await Categoria.getById(req.params.id);
            if (categoria) {
                res.json(categoria);
            } else {
                res.status(404).json({ message: 'Categoria não encontrada' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    createCategoria: async (req, res) => {
        try {
            const novaCategoria = await Categoria.create(req.body);
            res.status(201).json(novaCategoria);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateCategoria: async (req, res) => {
        try {
            const atualizada = await Categoria.update(req.params.id, req.body);
            if (atualizada) {
                res.json({ message: 'Categoria atualizada' });
            } else {
                res.status(404).json({ message: 'Categoria não encontrada' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deleteCategoria: async (req, res) => {
        try {
            const deletada = await Categoria.delete(req.params.id);
            if (deletada) {
                res.json({ message: 'Categoria deletada' });
            } else {
                res.status(404).json({ message: 'Categoria não encontrada' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = categoriaController;
