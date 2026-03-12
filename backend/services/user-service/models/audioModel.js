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
            const { temas_idtemas, usuarios_idusuarios, imagens_idimagens, visualizacoes, titulo, descricao, idiomas_ididiomas } = audioData;
            const [result] = await connection.query(
                'INSERT INTO audios (temas_idtemas, usuarios_idusuarios, imagens_idimagens, visualizacoes, titulo, descricao, idiomas_ididiomas) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [temas_idtemas, usuarios_idusuarios, imagens_idimagens, visualizacoes || 0, titulo, descricao, idiomas_ididiomas]
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
            const { temas_idtemas, usuarios_idusuarios, imagens_idimagens, visualizacoes, titulo, descricao, idiomas_ididiomas } = audioData;
            const [result] = await connection.query(
                'UPDATE audios SET temas_idtemas = ?, usuarios_idusuarios = ?, imagens_idimagens = ?, visualizacoes = ?, titulo = ?, descricao = ?, idiomas_ididiomas = ? WHERE idaudios = ?',
                [temas_idtemas, usuarios_idusuarios, imagens_idimagens, visualizacoes, titulo, descricao, idiomas_ididiomas, id]
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