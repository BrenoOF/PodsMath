const ConfigNivelAcesso = require('../models/configNivelAcessoModel');

const configNivelAcessoController = {
    getAllConfigNivelAcesso: async (req, res) => {
        try {
            const configs = await ConfigNivelAcesso.getAll();
            res.json(configs);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getConfigNivelAcessoById: async (req, res) => {
        try {
            const config = await ConfigNivelAcesso.getById(req.params.id);
            if (config) {
                res.json(config);
            } else {
                res.status(404).json({ message: 'Configuração de Nível de Acesso não encontrada' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    createConfigNivelAcesso: async (req, res) => {
        try {
            const novaConfig = await ConfigNivelAcesso.create(req.body);
            res.status(201).json(novaConfig);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateConfigNivelAcesso: async (req, res) => {
        try {
            const atualizada = await ConfigNivelAcesso.update(req.params.id, req.body);
            if (atualizada) {
                res.json({ message: 'Configuração de Nível de Acesso atualizada' });
            } else {
                res.status(404).json({ message: 'Configuração de Nível de Acesso não encontrada' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deleteConfigNivelAcesso: async (req, res) => {
        try {
            const deletada = await ConfigNivelAcesso.delete(req.params.id);
            if (deletada) {
                res.json({ message: 'Configuração de Nível de Acesso deletada' });
            } else {
                res.status(404).json({ message: 'Configuração de Nível de Acesso não encontrada' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = configNivelAcessoController;
