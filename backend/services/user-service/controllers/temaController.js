const Tema = require('../models/temaModel');
const Imagem = require('../models/imagemModel');

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
      const temaData = { ...req.body };

      // Se uma imagem foi enviada e processada
      if (req.processedFile) {
        const caminho_imagem = req.processedFile.relativeUrl;
        const newImagem = await Imagem.create({ caminho_imagem });
        temaData.imagens_idimagens = newImagem.idimagens;
      }

      const newTema = await Tema.create(temaData);
      res.status(201).json(newTema);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateTema: async (req, res) => {
    try {
      const temaData = { ...req.body };

      // Se uma nova imagem foi enviada e processada
      if (req.processedFile) {
        const tema = await Tema.getById(req.params.id);
        const caminho_imagem = req.processedFile.relativeUrl;

        if (tema.imagens_idimagens) {
          // Atualiza imagem existente
          await Imagem.update(tema.imagens_idimagens, { caminho_imagem });
        } else {
          // Cria nova imagem
          const newImagem = await Imagem.create({ caminho_imagem });
          temaData.imagens_idimagens = newImagem.idimagens;
        }
      }

      const updated = await Tema.update(req.params.id, temaData);
      if (updated) {
        res.json({ message: 'Tema atualizada' });
      } else {
        res.status(404).json({ message: 'Tema não encontrada' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteTema: async (req, res) => {
    try {
      const deleted = await Tema.delete(req.params.id);
      if (deleted) {
        res.json({ message: 'Tema deletada' });
      } else {
        res.status(404).json({ message: 'Tema não encontrada' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};


module.exports = temaController;
