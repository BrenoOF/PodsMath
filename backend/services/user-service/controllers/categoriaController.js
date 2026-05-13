const Categoria = require('../models/categoriaModel');
const Imagem = require('../models/imagemModel');
const path = require('path');
const fs = require('fs');

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
      let imagens_idimagens = req.body.imagens_idimagens || 1;

      if (req.processedFile) {
        const newImagem = await Imagem.create({
          caminho_imagem: req.processedFile.relativeUrl
        });
        imagens_idimagens = newImagem.idimagens;
      }

      const newCategoria = await Categoria.create({
        ...req.body,
        imagens_idimagens
      });
      res.status(201).json(newCategoria);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateCategoria: async (req, res) => {
    try {
      const existing = await Categoria.getById(req.params.id);
      if (!existing) return res.status(404).json({ message: 'Categoria não encontrada' });

      let imagens_idimagens = existing.imagens_idimagens;

      if (req.processedFile) {
        if (imagens_idimagens && imagens_idimagens > 1) {
          // Apagar imagem física antiga e atualizar registro
          const oldImagem = await Imagem.getById(imagens_idimagens);
          if (oldImagem?.caminho_imagem) {
            const oldPath = path.join(__dirname, '../uploads/', oldImagem.caminho_imagem);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
          }
          await Imagem.update(imagens_idimagens, {
            caminho_imagem: req.processedFile.relativeUrl
          });
        } else {
          // Criar nova imagem se era default
          const newImagem = await Imagem.create({
            caminho_imagem: req.processedFile.relativeUrl
          });
          imagens_idimagens = newImagem.idimagens;
        }
      }

      const categoriaData = {
        ...req.body,
        imagens_idimagens
      };

      const updated = await Categoria.update(req.params.id, categoriaData);
      if (updated) {
        const updatedCategoria = await Categoria.getById(req.params.id);
        res.json(updatedCategoria);
      } else {
        res.status(404).json({ message: 'Categoria não encontrada' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteCategoria: async (req, res) => {
    try {
      const existing = await Categoria.getById(req.params.id);
      if (!existing) return res.status(404).json({ message: 'Categoria não encontrada' });

      const imagens_idimagens = existing.imagens_idimagens;
      const deleted = await Categoria.delete(req.params.id);

      if (deleted && imagens_idimagens > 1) {
        // Apagar imagem física e DB record (se não for default)
        const imageRecord = await Imagem.getById(imagens_idimagens);
        if (imageRecord?.caminho_imagem) {
          const fullPath = path.join(__dirname, '../uploads/', imageRecord.caminho_imagem);
          if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
        }
        await Imagem.delete(imagens_idimagens);
      }

      res.json({ message: 'Categoria deletada' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = categoriaController;
