const pool = require('../db/connections');

const Categoria = {
    getAll: async () => {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const [rows] = await connection.query('SELECT * FROM categorias');
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
            const [rows] = await connection.query('SELECT * FROM categorias WHERE idcategorias = ?', [id]);
            await connection.commit();
            return rows[0];
        } catch (error) {
            if (connection) await connection.rollback();
            throw error;
        } finally {
            if (connection) connection.release();
        }
    },

    create: async ({ nome, imagens_idimagens }) => {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const [result] = await connection.query(
                'INSERT INTO categorias (nome, imagens_idimagens) VALUES (?, ?)',
                [nome, imagens_idimagens]
            );
            await connection.commit();
            return { idcategorias: result.insertId, nome, imagens_idimagens };
        } catch (error) {
            if (connection) await connection.rollback();
            throw error;
        } finally {
            if (connection) connection.release();
        }
    },

    update: async (id, { nome, imagens_idimagens }) => {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const [result] = await connection.query(
                'UPDATE categorias SET nome = ?, imagens_idimagens = ? WHERE idcategorias = ?',
                [nome, imagens_idimagens, id]
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
            const [result] = await connection.query('DELETE FROM categorias WHERE idcategorias = ?', [id]);
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

module.exports = Categoria;
