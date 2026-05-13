const pool = require('../db/connections');

const Estatisticas = {
  getDashboardStats: async () => {
    let connection;
    try {
      connection = await pool.getConnection();
      await connection.beginTransaction();

      const queries = [
        'SELECT COUNT(*) as total FROM audios',
        'SELECT COUNT(*) as total FROM usuarios',
        'SELECT SUM(visualizacoes) as total FROM audios',
        'SELECT COUNT(*) as total FROM categorias',
        'SELECT COUNT(*) as total FROM temas'
      ];

      const results = await Promise.all(
        queries.map(query => connection.query(query))
      );

      await connection.commit();

      return {
        totalPodcasts: results[0][0][0].total,
        totalUsuarios: results[1][0][0].total,
        totalVisualizacoes: results[2][0][0].total || 0,
        totalCategorias: results[3][0][0].total,
        totalTemas: results[4][0][0].total,
        totalCategoriaTema: results[3][0][0].total + results[4][0][0].total
      };
    } catch (error) {
      if (connection) await connection.rollback();
      throw error;
    } finally {
      if (connection) connection.release();
    }
  }
};

module.exports = Estatisticas;
