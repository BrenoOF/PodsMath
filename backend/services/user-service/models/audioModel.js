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
        const { usuarios_idusuarios, imagens_idimagens, visualizacoes, titulo, descricao, idiomas_ididiomas, caminho_audio } = audioData;
        const [result] = await pool.query(
            'INSERT INTO audios (usuarios_idusuarios, imagens_idimagens, visualizacoes, titulo, descricao, idiomas_ididiomas, caminho_audio) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [usuarios_idusuarios, imagens_idimagens, visualizacoes, titulo, descricao, idiomas_ididiomas, caminho_audio]
        );
        return { idaudios: result.insertId, ...audioData };
    },

    update: async (id, audioData) => {
        const { usuarios_idusuarios, imagens_idimagens, visualizacoes, titulo, descricao, idiomas_ididiomas, caminho_audio } = audioData;
        const [result] = await pool.query(
            'UPDATE audios SET usuarios_idusuarios = ?, imagens_idimagens = ?, visualizacoes = ?, titulo = ?, descricao = ?, idiomas_ididiomas = ?, caminho_audio = ? WHERE idaudios = ?',
            [usuarios_idusuarios, imagens_idimagens, visualizacoes, titulo, descricao, idiomas_ididiomas, caminho_audio, id]
        );
        return result.affectedRows > 0;
    },

    delete: async (id) => {
        const [result] = await pool.query('DELETE FROM audios WHERE idaudios = ?', [id]);
        return result.affectedRows > 0;
    }
};

module.exports = Audio;