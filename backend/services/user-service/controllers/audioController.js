const Audio = require('../models/audioModel');
const Imagem = require('../models/imagemModel');
const path = require('path');
const fs = require('fs');

const audioController = {
  getAllAudios: async (req, res) => {
    try {
      const audios = await Audio.getAll();
      res.json(audios);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getAudioById: async (req, res) => {
    try {
      const audio = await Audio.getById(req.params.id);
      if (audio) {
        res.json(audio);
      } else {
        res.status(404).json({ message: 'Audio não encontrado' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getAudiosByTema: async (req, res) => {
    try {
      const audios = await Audio.getByTema(req.params.idTema);
      res.json(audios);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getAudioDetailsById: async (req, res) => {
    try {
      const audio = await Audio.getDetailsById(req.params.id);
      if (audio) {
        res.json(audio);
      } else {
        res.status(404).json({ message: 'Audio não encontrado' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createAudio: async (req, res) => {
    try {
      let imagens_idimagens = req.body.imagens_idimagens || 1;

      if (req.processedFile) {
        const newImagem = await Imagem.create({
          caminho_imagem: req.processedFile.relativeUrl
        });
        imagens_idimagens = newImagem.idimagens;
      }

      const newAudio = await Audio.create({
        ...req.body,
        imagens_idimagens,
        usuarios_idusuarios: req.usuario.idusuarios
      });
      res.status(201).json(newAudio);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateAudio: async (req, res) => {
    try {
      const existing = await Audio.getById(req.params.id);
      if (!existing) return res.status(404).json({ message: 'Audio não encontrado' });

      let imagens_idimagens = existing.imagens_idimagens;

      if (req.processedFile) {
        // Apagar imagem física antiga e atualizar registro
        if (imagens_idimagens && imagens_idimagens > 1) {
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

      const audioData = {
        ...req.body,
        imagens_idimagens,
        usuarios_idusuarios: req.usuario.idusuarios
      };

      const updated = await Audio.update(req.params.id, audioData);
      if (updated) {
        const updatedAudio = await Audio.getById(req.params.id);
        res.json(updatedAudio);
      } else {
        res.status(404).json({ message: 'Audio não encontrado' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteAudio: async (req, res) => {
    try {
      const existing = await Audio.getById(req.params.id);
      if (!existing) return res.status(404).json({ message: 'Audio não encontrado' });

      const imagens_idimagens = existing.imagens_idimagens;
      const deleted = await Audio.delete(req.params.id);

      if (deleted && imagens_idimagens > 1) {
        // Apagar imagem física e DB record (se não for default)
        const imageRecord = await Imagem.getById(imagens_idimagens);
        if (imageRecord?.caminho_imagem) {
          const fullPath = path.join(__dirname, '../uploads/', imageRecord.caminho_imagem);
          if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
        }
        await Imagem.delete(imagens_idimagens);
      }

      res.json({ message: 'Audio deletado' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getHighlights: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const audios = await Audio.getHighlights(limit);
      res.json(audios);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getRecent: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const audios = await Audio.getRecent(limit);
      res.json(audios);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getOwnAudios: async (req, res) => {
    try {
      const userId = req.usuario.idusuarios;
      const audios = await Audio.getByUser(userId);
      res.json(audios);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = audioController;
