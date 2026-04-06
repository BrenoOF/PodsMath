const Instituicao = require('../models/instituicaoModel');
const Imagem = require('../models/imagemModel');

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
      const instituicaoData = { ...req.body };

      // Se uma imagem foi enviada e processada
      if (req.processedFile) {
        const caminho_imagem = req.processedFile.relativeUrl;
        const newImagem = await Imagem.create({ caminho_imagem });
        instituicaoData.imagens_idimagens = newImagem.idimagens;
      }

      const newInstituicao = await Instituicao.create(instituicaoData);
      res.status(201).json(newInstituicao);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateInstituicao: async (req, res) => {
    try {
      const instituicaoData = { ...req.body };

      // Se uma nova imagem foi enviada e processada
      if (req.processedFile) {
        const instituicao = await Instituicao.getById(req.params.id);
        const caminho_imagem = req.processedFile.relativeUrl;

        if (instituicao.imagens_idimagens) {
          // Atualiza imagem existente
          await Imagem.update(instituicao.imagens_idimagens, { caminho_imagem });
        } else {
          // Cria nova imagem
          const newImagem = await Imagem.create({ caminho_imagem });
          instituicaoData.imagens_idimagens = newImagem.idimagens;
        }
      }

      const updated = await Instituicao.update(req.params.id, instituicaoData);
      if (updated) {
        res.json({ message: 'Instituicao atualizada' });
      } else {
        res.status(404).json({ message: 'Instituicao não encontrada' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteInstituicao: async (req, res) => {
    try {
      const deleted = await Instituicao.delete(req.params.id);
      if (deleted) {
        res.json({ message: 'Instituicao deletada' });
      } else {
        res.status(404).json({ message: 'Instituicao não encontrada' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = instituicaoController;
