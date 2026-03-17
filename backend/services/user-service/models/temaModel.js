const pool = require('../db/connections');

const Tema = {
    getAll: async () => {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const [rows] = await connection.query('SELECT * FROM temas');
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
            const [rows] = await connection.query('SELECT *, i.caminho_imagem FROM temas t LEFT JOIN imagens i ON i.idimagens = t.imagens_idimagens WHERE t.idtemas = ?', [id]);
            await connection.commit();
            return rows[0];
        } catch (error) {
            if (connection) await connection.rollback();
            throw error;
        } finally {
            if (connection) connection.release();
        }
    },

    getByCategoria: async (categoriaId) => {
        let connection;
        try {
            connection = await pool.getConnection();
            const [rows] = await connection.query('SELECT * FROM temas t LEFT JOIN imagens i ON i.idimagens = t.imagens_idimagens WHERE t.categorias_idcategorias = ?;', [categoriaId]);
            return rows;
        } catch (error) {
            throw error;
        } finally {
            if (connection) connection.release();
        }
    },

    create: async ({ titulo, categorias_idcategorias, imagens_idimagens }) => {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const [result] = await connection.query(
                'INSERT INTO temas (titulo, categorias_idcategorias, imagens_idimagens) VALUES (?, ?, ?)',
                [titulo, categorias_idcategorias, imagens_idimagens]
            );
            await connection.commit();
            return { idtemas: result.insertId, titulo, categorias_idcategorias, imagens_idimagens };
        } catch (error) {
            if (connection) await connection.rollback();
            throw error;
        } finally {
            if (connection) connection.release();
        }
    },

    update: async (id, { titulo, categorias_idcategorias, imagens_idimagens }) => {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const [result] = await connection.query(
                'UPDATE temas SET titulo = ?, categorias_idcategorias = ?, imagens_idimagens = ? WHERE idtemas = ?',
                [titulo, categorias_idcategorias, imagens_idimagens, id]
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
            const [result] = await connection.query('DELETE FROM temas WHERE idtemas = ?', [id]);
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


module.exports = Tema;