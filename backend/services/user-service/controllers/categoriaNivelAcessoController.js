const CategoriaNivelAcesso = require('../models/categoriaNivelAcessoModel');

const categoriaNivelAcessoController = {
    getAllCategoriasNivelAcesso: async (req, res) => {
        try {
            const categorias = await CategoriaNivelAcesso.getAll();
            res.json(categorias);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getCategoriaNivelAcessoById: async (req, res) => {
        try {
            const categoria = await CategoriaNivelAcesso.getById(req.params.id);
            if (categoria) {
                res.json(categoria);
            } else {
                res.status(404).json({ message: 'Categoria Nível Acesso não encontrada' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    createCategoriaNivelAcesso: async (req, res) => {
        try {
            const novaCategoria = await CategoriaNivelAcesso.create(req.body);
            res.status(201).json(novaCategoria);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateCategoriaNivelAcesso: async (req, res) => {
        try {
            const atualizada = await CategoriaNivelAcesso.update(req.params.id, req.body);
            if (atualizada) {
                res.json({ message: 'Categoria Nível Acesso atualizada' });
            } else {
                res.status(404).json({ message: 'Categoria Nível Acesso não encontrada' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deleteCategoriaNivelAcesso: async (req, res) => {
        try {
            const deletada = await CategoriaNivelAcesso.delete(req.params.id);
            if (deletada) {
                res.json({ message: 'Categoria Nível Acesso deletada' });
            } else {
                res.status(404).json({ message: 'Categoria Nível Acesso não encontrada' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = categoriaNivelAcessoController;
