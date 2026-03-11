const pool = require('../db/connections');

const Transcricao = {
    getAll: async () => {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const [rows] = await connection.query('SELECT * FROM transcricao');
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
            const [rows] = await connection.query('SELECT * FROM transcricao WHERE idTranscricao = ?', [id]);
            await connection.commit();
            return rows[0];
        } catch (error) {
            if (connection) await connection.rollback();
            throw error;
        } finally {
            if (connection) connection.release();
        }
    },

    create: async ({ textoTranscricao, audios_idaudios, idiomas_ididiomas }) => {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const [result] = await connection.query(
                'INSERT INTO transcricao (textoTranscricao, audios_idaudios, idiomas_ididiomas) VALUES (?, ?, ?)',
                [textoTranscricao, audios_idaudios, idiomas_ididiomas]
            );
            await connection.commit();
            return { idTranscricao: result.insertId, textoTranscricao, audios_idaudios, idiomas_ididiomas };
        } catch (error) {
            if (connection) await connection.rollback();
            throw error;
        } finally {
            if (connection) connection.release();
        }
    },

    update: async (id, { textoTranscricao, audios_idaudios, idiomas_ididiomas }) => {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const [result] = await connection.query(
                'UPDATE transcricao SET textoTranscricao = ?, audios_idaudios = ?, idiomas_ididiomas = ? WHERE idTranscricao = ?',
                [textoTranscricao, audios_idaudios, idiomas_ididiomas, id]
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
            const [result] = await connection.query('DELETE FROM transcricao WHERE idTranscricao = ?', [id]);
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

module.exports = Transcricao;