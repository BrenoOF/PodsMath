const pool = require('../db/connections');

const CategoriaNivelAcesso = {
    getAll: async () => {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const [rows] = await connection.query('SELECT * FROM categoria_nivel_acesso');
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
            const [rows] = await connection.query('SELECT * FROM categoria_nivel_acesso WHERE idcategoria = ?', [id]);
            await connection.commit();
            return rows[0];
        } catch (error) {
            if (connection) await connection.rollback();
            throw error;
        } finally {
            if (connection) connection.release();
        }
    },

    create: async ({ nomecategoria, idnivel_acesso }) => {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const [result] = await connection.query(
                'INSERT INTO categoria_nivel_acesso (nomecategoria, idnivel_acesso) VALUES (?, ?)',
                [nomecategoria, idnivel_acesso]
            );
            await connection.commit();
            return { idcategoria: result.insertId, nomecategoria, idnivel_acesso };
        } catch (error) {
            if (connection) await connection.rollback();
            throw error;
        } finally {
            if (connection) connection.release();
        }
    },

    update: async (id, { nomecategoria, idnivel_acesso }) => {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const [result] = await connection.query(
                'UPDATE categoria_nivel_acesso SET nomecategoria = ?, idnivel_acesso = ? WHERE idcategoria = ?',
                [nomecategoria, idnivel_acesso, id]
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
            const [result] = await connection.query('DELETE FROM categoria_nivel_acesso WHERE idcategoria = ?', [id]);
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

module.exports = CategoriaNivelAcesso;
