const Usuario = require('../models/usuarioModel');

const usuarioController = {
    getAllUsuarios: async (req, res) => {
        try {
            const usuarios = await Usuario.getAll();
            res.json(usuarios);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getUsuarioById: async (req, res) => {
        try {
            const usuario = await Usuario.getById(req.params.id);
            if (usuario) {
                res.json(usuario);
            } else {
                res.status(404).json({ message: 'Usuario não encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    createUsuario: async (req, res) => {
        try {
            const newUsuario = await Usuario.create(req.body);
            res.status(201).json(newUsuario);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateUsuario: async (req, res) => {
        try {
            const updated = await Usuario.update(req.params.id, req.body);
            if (updated) {
                res.json({ message: 'Usuario atualizado' });
            } else {
                res.status(404).json({ message: 'Usuario não encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deleteUsuario: async (req, res) => {
        try {
            const deleted = await Usuario.delete(req.params.id);
            if (deleted) {
                res.json({ message: 'Usuario deletado' });
            } else {
                res.status(404).json({ message: 'Usuario não encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = usuarioController;
