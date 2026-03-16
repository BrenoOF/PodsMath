const pool = require('../db/connections');

const Imagem = {
    getAll: async () => {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const [rows] = await connection.query('SELECT * FROM imagens');
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
            const [rows] = await connection.query('SELECT * FROM imagens WHERE idimagens = ?', [id]);
            await connection.commit();
            return rows[0];
        } catch (error) {
            if (connection) await connection.rollback();
            throw error;
        } finally {
            if (connection) connection.release();
        }
    },

    create: async ({ idimagens, caminho_imagem }) => {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();
            
            let query = 'INSERT INTO imagens (caminho_imagem) VALUES (?)';
            let params = [caminho_imagem];
            
            if (idimagens) {
                query = 'INSERT INTO imagens (idimagens, caminho_imagem) VALUES (?, ?)';
                params = [idimagens, caminho_imagem];
            }

            const [result] = await connection.query(query, params);
            await connection.commit();
            return { idimagens: result.insertId, caminho_imagem };
        } catch (error) {
            if (connection) await connection.rollback();
            throw error;
        } finally {
            if (connection) connection.release();
        }
    },

    update: async (id, { caminho_imagem }) => {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const [result] = await connection.query(
                'UPDATE imagens SET caminho_imagem = ? WHERE idimagens = ?',
                [caminho_imagem, id]
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
            const [result] = await connection.query('DELETE FROM imagens WHERE idimagens = ?', [id]);
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

module.exports = Imagem;