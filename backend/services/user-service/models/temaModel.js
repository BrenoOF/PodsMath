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
            await connection.beginTransaction();
            const [rows] = await connection.query('SELECT * FROM temas t LEFT JOIN imagens i ON i.idimagens = t.imagens_idimagens WHERE t.categorias_idcategorias = ?;', [categoriaId]);
            await connection.commit();
            return rows;
        } catch (error) {
            if (connection) await connection.rollback();
            throw error;
        } finally {
            if (connection) connection.release();
        }
    },

    getDestaque: async (limit = 10) => {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const [rows] = await connection.query(`
                SELECT 
                    t.idtemas,
                    t.titulo,
                    t.categorias_idcategorias,
                    i.caminho_imagem as imagem_caminho,
                    COUNT(a.idaudios) AS quantidade_audios,
                    COALESCE(AVG(a.visualizacoes), 0) AS media_visualizacoes_por_audio
                FROM temas t
                LEFT JOIN imagens i ON i.idimagens = t.imagens_idimagens
                LEFT JOIN audios a ON a.temas_idtemas = t.idtemas
                GROUP BY 
                    t.idtemas,
                    t.titulo,
                    t.categorias_idcategorias,
                    i.caminho_imagem
                ORDER BY 
                    media_visualizacoes_por_audio DESC
                LIMIT ?;
            `, [limit]);
            await connection.commit();
            return rows;
        } catch (error) {
            if (connection) await connection.rollback();
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