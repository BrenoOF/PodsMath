const pool = require('../db/connections');

const Usuario = {
    getAll: async () => {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const [rows] = await connection.query(`
                SELECT u.*, n.nome as nome_nivel_acesso 
                FROM usuarios u 
                LEFT JOIN nivel_acesso n ON u.nivel_acesso_idnivel_acesso = n.idnivel_acesso
            `);
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
            const [rows] = await connection.query(`
                SELECT u.*, n.nome as nome_nivel_acesso 
                FROM usuarios u 
                LEFT JOIN nivel_acesso n ON u.nivel_acesso_idnivel_acesso = n.idnivel_acesso 
                WHERE u.idusuarios = ?
            `, [id]);
            await connection.commit();
            return rows[0];
        } catch (error) {
            if (connection) await connection.rollback();
            throw error;
        } finally {
            if (connection) connection.release();
        }
    },

    findByEmail: async (email) => {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const [rows] = await connection.query(`
                SELECT u.*, n.nome as nome_nivel_acesso 
                FROM usuarios u 
                LEFT JOIN nivel_acesso n ON u.nivel_acesso_idnivel_acesso = n.idnivel_acesso 
                WHERE u.email = ?
            `, [email]);
            await connection.commit();
            return rows[0];
        } catch (error) {
            if (connection) await connection.rollback();
            throw error;
        } finally {
            if (connection) connection.release();
        }
    },

    create: async (usuarioData) => {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const { idusuarios, instituicoes_idinstituicoes, nome, email, senha, id_usuario_professor, nivel_acesso_idnivel_acesso, paletaCor_idpaletaCor, audiosEscutados, imagens_idimagens } = usuarioData;
            const [result] = await connection.query(
                'INSERT INTO usuarios (idusuarios, instituicoes_idinstituicoes, nome, email, senha, id_usuario_professor, nivel_acesso_idnivel_acesso, paletaCor_idpaletaCor, audiosEscutados, imagens_idimagens) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [idusuarios, instituicoes_idinstituicoes, nome, email, senha, id_usuario_professor, nivel_acesso_idnivel_acesso, paletaCor_idpaletaCor, audiosEscutados, imagens_idimagens]
            );
            await connection.commit();
            return { idusuarios: result.insertId, ...usuarioData };
        } catch (error) {
            if (connection) await connection.rollback();
            throw error;
        } finally {
            if (connection) connection.release();
        }
    },

    update: async (id, usuarioData) => {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const { instituicoes_idinstituicoes, nome, email, senha, id_usuario_professor, nivel_acesso_idnivel_acesso, paletaCor_idpaletaCor, audiosEscutados } = usuarioData;
            const [result] = await connection.query(
                'UPDATE usuarios SET instituicoes_idinstituicoes = ?, nome = ?, email = ?, senha = ?, id_usuario_professor = ?, nivel_acesso_idnivel_acesso = ?, paletaCor_idpaletaCor = ?, audiosEscutados = ? WHERE idusuarios = ?',
                [instituicoes_idinstituicoes, nome, email, senha, id_usuario_professor, nivel_acesso_idnivel_acesso, paletaCor_idpaletaCor, audiosEscutados, id]
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
            const [result] = await connection.query('DELETE FROM usuarios WHERE idusuarios = ?', [id]);
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

module.exports = Usuario;