const Imagem = require('../models/imagemModel');
const path = require('path');
const fs = require('fs');

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
            if (!req.processedFile) {
                return res.status(400).json({ message: 'Nenhuma imagem enviada ou processada' });
            }

            const caminho_imagem = req.processedFile.relativeUrl;
            
            const newImagem = await Imagem.create({ caminho_imagem });
            res.status(201).json(newImagem);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateImagem: async (req, res) => {
        try {
            const data = { ...req.body };
            if (req.processedFile) {
                data.caminho_imagem = req.processedFile.relativeUrl;
            }

            const updated = await Imagem.update(req.params.id, data);
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
            const imagem = await Imagem.getById(req.params.id);
            if (!imagem) {
                return res.status(404).json({ message: 'Imagem não encontrada' });
            }

            // Remover arquivo físico
            if (imagem.caminho_imagem) {
                const fullPath = path.join(__dirname, '..', imagem.caminho_imagem);
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                }
            }

            const deleted = await Imagem.delete(req.params.id);
            if (deleted) {
                res.json({ message: 'Imagem deletada' });
            } else {
                res.status(404).json({ message: 'Imagem não encontrada' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    serveImage: async (req, res) => {
        try {
            const { filename } = req.params;
            const filePath = path.join(__dirname, '../uploads/images', filename);
            
            if (fs.existsSync(filePath)) {
                res.sendFile(filePath);
            } else {
                res.status(404).json({ message: 'Arquivo não encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = imagemController;
