const pool = require('../db/connections');

const Favorito = {
    getAll: async () => {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const [rows] = await connection.query('SELECT * FROM favoritos');
            await connection.commit();
            return rows;
        } catch (error) {
            if (connection) await connection.rollback();
            throw error;
        } finally {
            if (connection) connection.release();
        }
    },

    getByUsuarioId: async (usuarios_idusuarios) => {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const [rows] = await connection.query('SELECT * FROM favoritos WHERE usuarios_idusuarios = ?', [usuarios_idusuarios]);
            await connection.commit();
            return rows;
        } catch (error) {
            if (connection) await connection.rollback();
            throw error;
        } finally {
            if (connection) connection.release();
        }
    },

    create: async ({ usuarios_idusuarios, audios_idaudios }) => {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const [result] = await connection.query(
                'INSERT INTO favoritos (usuarios_idusuarios, audios_idaudios) VALUES (?, ?)',
                [usuarios_idusuarios, audios_idaudios]
            );
            await connection.commit();
            return { usuarios_idusuarios, audios_idaudios };
        } catch (error) {
            if (connection) await connection.rollback();
            throw error;
        } finally {
            if (connection) connection.release();
        }
    },

    delete: async (usuarios_idusuarios, audios_idaudios) => {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const [result] = await connection.query('DELETE FROM favoritos WHERE usuarios_idusuarios = ? AND audios_idaudios = ?', [usuarios_idusuarios, audios_idaudios]);
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

module.exports = Favorito;
