const Instituicao = require('../models/instituicaoModel');
const Imagem = require('../models/imagemModel');
const path = require('path');
const fs = require('fs');

const instituicaoController = {
  getAllInstituicaos: async (req, res) => {
    try {
      const instituicaos = await Instituicao.getAll();
      res.json(instituicaos);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getInstituicaoById: async (req, res) => {
    try {
      const instituicao = await Instituicao.getById(req.params.id);
      if (instituicao) {
        res.json(instituicao);
      } else {
        res.status(404).json({ message: 'Instituicao não encontrada' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createInstituicao: async (req, res) => {
    try {
      let imagens_idimagens = req.body.imagens_idimagens || 1;

      if (req.processedFile) {
        const newImagem = await Imagem.create({
          caminho_imagem: req.processedFile.relativeUrl
        });
        imagens_idimagens = newImagem.idimagens;
      }

      const newInstituicao = await Instituicao.create({
        ...req.body,
        imagens_idimagens
      });
      res.status(201).json(newInstituicao);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateInstituicao: async (req, res) => {
    try {
      const existing = await Instituicao.getById(req.params.id);
      if (!existing) return res.status(404).json({ message: 'Instituicao não encontrada' });

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

      const instituicaoData = {
        ...req.body,
        imagens_idimagens
      };

      const updated = await Instituicao.update(req.params.id, instituicaoData);
      if (updated) {
        const updatedInstituicao = await Instituicao.getById(req.params.id);
        res.json(updatedInstituicao);
      } else {
        res.status(404).json({ message: 'Instituicao não encontrada' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteInstituicao: async (req, res) => {
    try {
      const existing = await Instituicao.getById(req.params.id);
      if (!existing) return res.status(404).json({ message: 'Instituicao não encontrada' });

      const imagens_idimagens = existing.imagens_idimagens;
      const deleted = await Instituicao.delete(req.params.id);

      if (deleted && imagens_idimagens > 1) {
        // Apagar imagem física e DB record (se não for default)
        const imageRecord = await Imagem.getById(imagens_idimagens);
        if (imageRecord?.caminho_imagem) {
          const fullPath = path.join(__dirname, '../uploads/', imageRecord.caminho_imagem);
          if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
        }
        await Imagem.delete(imagens_idimagens);
      }

      res.json({ message: 'Instituicao deletada' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = instituicaoController;
