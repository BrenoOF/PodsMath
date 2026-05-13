const Estatisticas = require('../models/estatisticasModel');

const estatisticasController = {
  getStats: async (req, res) => {
    try {
      const stats = await Estatisticas.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      res.status(500).json({
        error: 'Erro ao buscar estatísticas',
        message: error.message
      });
    }
  }
};

module.exports = estatisticasController;
