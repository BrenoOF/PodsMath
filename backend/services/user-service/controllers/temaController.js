const Tema = require('../models/temaModel');
const Imagem = require('../models/imagemModel');
const path = require('path');
const fs = require('fs');

const temaController = {
  getAllTemas: async (req, res) => {
    try {
      const temas = await Tema.getAll();
      res.json(temas);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getTemaById: async (req, res) => {
    try {
      const tema = await Tema.getById(req.params.id);
      if (tema) {
        res.json(tema);
      } else {
        res.status(404).json({ message: 'Tema não encontrada' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getTemasByCategoria: async (req, res) => {
    try {
      const temas = await Tema.getByCategoria(req.params.idCategoria);
      res.json(temas);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getTemasDestaque: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const temas = await Tema.getDestaque(limit);
      res.json(temas);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createTema: async (req, res) => {
    try {
      let imagens_idimagens = req.body.imagens_idimagens || 1;

      if (req.processedFile) {
        const newImagem = await Imagem.create({
          caminho_imagem: req.processedFile.relativeUrl
        });
        imagens_idimagens = newImagem.idimagens;
      }

      const newTema = await Tema.create({
        ...req.body,
        imagens_idimagens
      });
      res.status(201).json(newTema);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateTema: async (req, res) => {
    try {
      const existing = await Tema.getById(req.params.id);
      if (!existing) return res.status(404).json({ message: 'Tema não encontrado' });

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

      const temaData = {
        ...req.body,
        imagens_idimagens
      };

      const updated = await Tema.update(req.params.id, temaData);
      if (updated) {
        const updatedTema = await Tema.getById(req.params.id);
        res.json(updatedTema);
      } else {
        res.status(404).json({ message: 'Tema não encontrado' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteTema: async (req, res) => {
    try {
      const existing = await Tema.getById(req.params.id);
      if (!existing) return res.status(404).json({ message: 'Tema não encontrado' });

      const imagens_idimagens = existing.imagens_idimagens;
      const deleted = await Tema.delete(req.params.id);

      if (deleted && imagens_idimagens > 1) {
        // Apagar imagem física e DB record (se não for default)
        const imageRecord = await Imagem.getById(imagens_idimagens);
        if (imageRecord?.caminho_imagem) {
          const fullPath = path.join(__dirname, '../uploads/', imageRecord.caminho_imagem);
          if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
        }
        await Imagem.delete(imagens_idimagens);
      }

      res.json({ message: 'Tema deletado' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = temaController;
