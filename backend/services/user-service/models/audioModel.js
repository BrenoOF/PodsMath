const pool = require('../db/connections');

const Audio = {
    getAll: async () => {
        const [rows] = await pool.query('SELECT * FROM audios');
        return rows;
    },

    getById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM audios WHERE idaudios = ?', [id]);
        return rows[0];
    },

    create: async (audioData) => {
        const { temas_idtemas, usuarios_idusuarios, imagens_idimagens, visualizacoes, titulo, descricao, idiomas_ididiomas, idiomas_imagens_idimagens } = audioData;
        const [result] = await pool.query(
            'INSERT INTO audios (temas_idtemas, usuarios_idusuarios, imagens_idimagens, visualizacoes, titulo, descricao, idiomas_ididiomas, idiomas_imagens_idimagens) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [temas_idtemas, usuarios_idusuarios, imagens_idimagens, visualizacoes, titulo, descricao, idiomas_ididiomas, idiomas_imagens_idimagens]
        );
        return { idaudios: result.insertId, ...audioData };
    },

    update: async (id, audioData) => {
        const { temas_idtemas, usuarios_idusuarios, imagens_idimagens, visualizacoes, titulo, descricao, idiomas_ididiomas, idiomas_imagens_idimagens } = audioData;
        const [result] = await pool.query(
            'UPDATE audios SET temas_idtemas = ?, usuarios_idusuarios = ?, imagens_idimagens = ?, visualizacoes = ?, titulo = ?, descricao = ?, idiomas_ididiomas = ?, idiomas_imagens_idimagens = ? WHERE idaudios = ?',
            [temas_idtemas, usuarios_idusuarios, imagens_idimagens, visualizacoes, titulo, descricao, idiomas_ididiomas, idiomas_imagens_idimagens, id]
        );
        return result.affectedRows > 0;
    },

    delete: async (id) => {
        const [result] = await pool.query('DELETE FROM audios WHERE idaudios = ?', [id]);
        return result.affectedRows > 0;
    }
};

module.exports = Audio;