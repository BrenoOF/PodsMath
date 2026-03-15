const pool = require('../db/connections');

const Historico = {
    getAll: async () => {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const [rows] = await connection.query('SELECT * FROM historico');
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
            const [rows] = await connection.query('SELECT * FROM historico WHERE idhistorico = ?', [id]);
            await connection.commit();
            return rows[0];
        } catch (error) {
            if (connection) await connection.rollback();
            throw error;
        } finally {
            if (connection) connection.release();
        }
    },

    getByUsuarioId: async (usuarioId) => {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const [rows] = await connection.query('SELECT * FROM historico WHERE usuarios_idusuarios = ?', [usuarioId]);
            await connection.commit();
            return rows;
        } catch (error) {
            if (connection) await connection.rollback();
            throw error;
        } finally {
            if (connection) connection.release();
        }
    },

    create: async ({ idhistorico, usuarios_idusuarios, audios_idaudios, tempo_audio }) => {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const [result] = await connection.query(
                'INSERT INTO historico (idhistorico, usuarios_idusuarios, audios_idaudios, tempo_audio) VALUES (?, ?, ?, ?)',
                [idhistorico, usuarios_idusuarios, audios_idaudios, tempo_audio]
            );
            await connection.commit();
            return { idhistorico: result.insertId, usuarios_idusuarios, audios_idaudios, tempo_audio };
        } catch (error) {
            if (connection) await connection.rollback();
            throw error;
        } finally {
            if (connection) connection.release();
        }
    },

    update: async (id, { usuarios_idusuarios, audios_idaudios, tempo_audio }) => {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const [result] = await connection.query(
                'UPDATE historico SET usuarios_idusuarios = ?, audios_idaudios = ?, tempo_audio = ? WHERE idhistorico = ?',
                [usuarios_idusuarios, audios_idaudios, tempo_audio, id]
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
            const [result] = await connection.query('DELETE FROM historico WHERE idhistorico = ?', [id]);
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

module.exports = Historico;