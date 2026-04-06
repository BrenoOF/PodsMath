const Categoria = require('../models/categoriaModel');
const Imagem = require('../models/imagemModel');

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
      const categoriaData = { ...req.body };

      // Se uma imagem foi enviada e processada
      if (req.processedFile) {
        const caminho_imagem = req.processedFile.relativeUrl;
        const newImagem = await Imagem.create({ caminho_imagem });
        categoriaData.imagens_idimagens = newImagem.idimagens;
      }

      const novaCategoria = await Categoria.create(categoriaData);
      res.status(201).json(novaCategoria);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateCategoria: async (req, res) => {
    try {
      const categoriaData = { ...req.body };

      // Se uma nova imagem foi enviada e processada
      if (req.processedFile) {
        const categoria = await Categoria.getById(req.params.id);
        const caminho_imagem = req.processedFile.relativeUrl;

        if (categoria.imagens_idimagens) {
          // Atualiza imagem existente
          await Imagem.update(categoria.imagens_idimagens, { caminho_imagem });
        } else {
          // Cria nova imagem
          const newImagem = await Imagem.create({ caminho_imagem });
          categoriaData.imagens_idimagens = newImagem.idimagens;
        }
      }

      const atualizada = await Categoria.update(req.params.id, categoriaData);
      if (atualizada) {
        res.json({ message: 'Categoria atualizada' });
      } else {
        res.status(404).json({ message: 'Categoria não encontrada' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteCategoria: async (req, res) => {
    try {
      const deletada = await Categoria.delete(req.params.id);
      if (deletada) {
        res.json({ message: 'Categoria deletada' });
      } else {
        res.status(404).json({ message: 'Categoria não encontrada' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = categoriaController;
