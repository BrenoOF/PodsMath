const Favorito = require('../models/favoritoModel');

const favoritoController = {
    getAllFavoritos: async (req, res) => {
        try {
            const favoritos = await Favorito.getAll();
            res.json(favoritos);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getFavoritosByUsuarioId: async (req, res) => {
        try {
            const favoritos = await Favorito.getByUsuarioId(req.usuario.idusuarios);
            if (favoritos) {
                res.json(favoritos);
            } else {
                res.status(404).json({ message: 'Favoritos não encontrados para este usuário' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    createFavorito: async (req, res) => {
        try {
            const novoFavorito = await Favorito.create({
                ...req.body,
                usuarios_idusuarios: req.usuario.idusuarios
            });
            res.status(201).json(novoFavorito);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deleteFavorito: async (req, res) => {
        try {
            const deletada = await Favorito.delete(req.usuario.idusuarios, req.params.audioId);
            if (deletada) {
                res.json({ message: 'Favorito deletado' });
            } else {
                res.status(404).json({ message: 'Favorito não encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = favoritoController;
