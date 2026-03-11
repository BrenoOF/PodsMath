const pool = require('../db/connections');

const Audio = {
    getAll: async () => {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const [rows] = await connection.query('SELECT * FROM audios');
            await connection.commit();
            return rows;
        } catch (error) {
            if (connection) await connection.rollback();
            throw error;
        } finally {
            if (connection) connection.release();
        }
    },

    getById: async (id) => {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const [rows] = await connection.query('SELECT * FROM audios WHERE idaudios = ?', [id]);
            await connection.commit();
            return rows[0];
        } catch (error) {
            if (connection) await connection.rollback();
            throw error;
        } finally {
            if (connection) connection.release();
        }
    },

    create: async (audioData) => {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const { usuarios_idusuarios, imagens_idimagens, visualizacoes, titulo, descricao, idiomas_ididiomas, caminho_audio } = audioData;
            const [result] = await connection.query(
                'INSERT INTO audios (usuarios_idusuarios, imagens_idimagens, visualizacoes, titulo, descricao, idiomas_ididiomas, caminho_audio) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [usuarios_idusuarios, imagens_idimagens, visualizacoes, titulo, descricao, idiomas_ididiomas, caminho_audio]
            );
            await connection.commit();
            return { idaudios: result.insertId, ...audioData };
        } catch (error) {
            if (connection) await connection.rollback();
            throw error;
        } finally {
            if (connection) connection.release();
        }
    },

    update: async (id, audioData) => {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const { usuarios_idusuarios, imagens_idimagens, visualizacoes, titulo, descricao, idiomas_ididiomas, caminho_audio } = audioData;
            const [result] = await connection.query(
                'UPDATE audios SET usuarios_idusuarios = ?, imagens_idimagens = ?, visualizacoes = ?, titulo = ?, descricao = ?, idiomas_ididiomas = ?, caminho_audio = ? WHERE idaudios = ?',
                [usuarios_idusuarios, imagens_idimagens, visualizacoes, titulo, descricao, idiomas_ididiomas, caminho_audio, id]
            );
            await connection.commit();
            return result.affectedRows > 0;
        } catch (error) {
            if (connection) await connection.rollback();
            throw error;
        } finally {
            if (connection) connection.release();
        }
    },

    delete: async (id) => {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const [result] = await connection.query('DELETE FROM audios WHERE idaudios = ?', [id]);
            await connection.commit();
            return result.affectedRows > 0;
        } catch (error) {
            if (connection) await connection.rollback();
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }
};

module.exports = Audio;