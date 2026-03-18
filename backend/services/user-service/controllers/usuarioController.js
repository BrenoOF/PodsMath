const Usuario = require('../models/usuarioModel');
const Imagem = require('../models/imagemModel');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');

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

    getMe: async (req, res) => {
        try {
            const usuario = await Usuario.getById(req.usuario.idusuarios);
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
            const userData = { ...req.body };
            if (userData.senha) {
                userData.senha = await bcrypt.hash(userData.senha, 10);
            }
            const newUsuario = await Usuario.create(userData);
            res.status(201).json(newUsuario);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateUsuario: async (req, res) => {
        try {
            const userData = { ...req.body };
            if (userData.senha) {
                userData.senha = await bcrypt.hash(userData.senha, 10);
            }
            const updated = await Usuario.update(req.params.id, userData);
            if (updated) {
                res.json({ message: 'Usuario atualizado' });
            } else {
                res.status(404).json({ message: 'Usuario não encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateMe: async (req, res) => {
        try {
            const userData = { ...req.body };
            if (userData.senha) {
                userData.senha = await bcrypt.hash(userData.senha, 10);
            }
            const updated = await Usuario.update(req.usuario.idusuarios, userData);
            if (updated) {
                res.json({ message: 'Seu perfil foi atualizado' });
            } else {
                res.status(404).json({ message: 'Usuario não encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateMyImage: async (req, res) => {
        try {
            if (!req.processedFile) {
                return res.status(400).json({ message: 'Nenhuma imagem enviada ou processada' });
            }

            const usuario = await Usuario.getById(req.usuario.idusuarios);
            if (!usuario) {
                return res.status(404).json({ message: 'Usuario não encontrado' });
            }

            const caminho_imagem = req.processedFile.relativeUrl;
            let idImagem;

            if (usuario.imagens_idimagens) {
                // Atualiza imagem existente
                const antigaImagem = await Imagem.getById(usuario.imagens_idimagens);
                if (antigaImagem && antigaImagem.caminho_imagem) {
                    // Remove o prefixo se existir para não duplicar no join
                    const cleanPath = antigaImagem.caminho_imagem.replace(/^\/?uploads\//, '');
                    const fullPath = path.join(__dirname, '../uploads', cleanPath);
                    if (fs.existsSync(fullPath)) {
                        fs.unlinkSync(fullPath);
                    }
                }
                await Imagem.update(usuario.imagens_idimagens, { caminho_imagem });
                idImagem = usuario.imagens_idimagens;
            }
 else {
                // Cria nova imagem
                const newImagem = await Imagem.create({ caminho_imagem });
                idImagem = newImagem.idimagens;
                
                // Atualiza usuario com o novo ID de imagem
                const userData = { ...usuario, imagens_idimagens: idImagem };
                await Usuario.update(req.usuario.idusuarios, userData);
            }

            res.json({ 
                message: 'Imagem de perfil atualizada com sucesso',
                idImagem: idImagem,
                caminho_imagem: caminho_imagem
            });
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
    },

    deleteMe: async (req, res) => {
        try {
            const deleted = await Usuario.delete(req.usuario.idusuarios);
            if (deleted) {
                res.json({ message: 'Sua conta foi deletada' });
            } else {
                res.status(404).json({ message: 'Usuario não encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updatePassword: async (req, res) => {
        try {
            const { senhaAtual, senhaNova } = req.body;
            const idUsuario = req.usuario.idusuarios;

            if (!senhaAtual || !senhaNova) {
                return res.status(400).json({ message: 'Senha atual e nova senha são obrigatórias' });
            }

            const usuario = await Usuario.getById(idUsuario);
            if (!usuario) {
                return res.status(404).json({ message: 'Usuario não encontrado' });
            }

            const isMatch = await bcrypt.compare(senhaAtual, usuario.senha);
            if (!isMatch) {
                return res.status(401).json({ message: 'Senha atual incorreta' });
            }

            const senhaHash = await bcrypt.hash(senhaNova, 10);
            const updated = await Usuario.update(idUsuario, { ...usuario, senha: senhaHash });

            if (updated) {
                res.json({ message: 'Senha alterada com sucesso' });
            } else {
                res.status(500).json({ message: 'Erro ao atualizar senha' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = usuarioController;
