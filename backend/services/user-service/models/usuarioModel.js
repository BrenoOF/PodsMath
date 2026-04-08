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
                SELECT u.*, n.nome as nome_nivel_acesso, i.caminho_imagem
                FROM usuarios u 
                LEFT JOIN nivel_acesso n ON u.nivel_acesso_idnivel_acesso = n.idnivel_acesso 
                LEFT JOIN imagens i ON u.imagens_idimagens = i.idimagens
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
            const { instituicoes_idinstituicoes, nome, email, senha, id_usuario_professor, nivel_acesso_idnivel_acesso, paletaCor_idpaletaCor, audiosEscutados} = usuarioData;
            const [result] = await connection.query(
                'INSERT INTO usuarios (instituicoes_idinstituicoes, nome, email, senha, id_usuario_professor, nivel_acesso_idnivel_acesso, paletaCor_idpaletaCor, audiosEscutados) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [instituicoes_idinstituicoes, nome, email, senha, id_usuario_professor, nivel_acesso_idnivel_acesso, paletaCor_idpaletaCor, audiosEscutados]
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
            const { instituicoes_idinstituicoes, nome, email, id_usuario_professor, nivel_acesso_idnivel_acesso, paletaCor_idpaletaCor, audiosEscutados, imagens_idimagens } = usuarioData;
            const [result] = await connection.query(
                'UPDATE usuarios SET instituicoes_idinstituicoes = ?, nome = ?, email = ?, id_usuario_professor = ?, nivel_acesso_idnivel_acesso = ?, paletaCor_idpaletaCor = ?, audiosEscutados = ?, imagens_idimagens = ? WHERE idusuarios = ?',
                [instituicoes_idinstituicoes, nome, email, id_usuario_professor, nivel_acesso_idnivel_acesso, paletaCor_idpaletaCor, audiosEscutados, imagens_idimagens, id]
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

    updateSenha: async (id, usuarioData) => {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const { senha } = usuarioData;
            const [result] = await connection.query(
                'UPDATE usuarios SET senha = ? WHERE idusuarios = ?',
                [senha, id]
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

    updateNivelAcesso: async (id, usuarioData) => {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const { nivel_acesso_idnivel_acesso } = usuarioData;
            const [result] = await connection.query(
                'UPDATE usuarios SET nivel_acesso_idnivel_acesso = ? WHERE idusuarios = ?',
                [nivel_acesso_idnivel_acesso, id]
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

            // 1. Se o usuário for um professor, desvincula os alunos dele para evitar erro de Foreign Key
            await connection.query('UPDATE usuarios SET id_usuario_professor = NULL WHERE id_usuario_professor = ?', [id]);

            // 2. Buscar todos os áudios vinculados a este usuário
            const [audios] = await connection.query('SELECT idaudios FROM audios WHERE usuarios_idusuarios = ?', [id]);
            const audioIds = audios.map(audio => audio.idaudios);

            // Se o usuário tiver criado áudios, apagar as tabelas que dependem desses áudios primeiro
            if (audioIds.length > 0) {
                await connection.query('DELETE FROM transcricao WHERE audios_idaudios IN (?)', [audioIds]);
                await connection.query('DELETE FROM historico WHERE audios_idaudios IN (?)', [audioIds]);
                await connection.query('DELETE FROM favoritos WHERE audios_idaudios IN (?)', [audioIds]);
            }

            // 3. Apagar dependências diretas do usuário em outras tabelas
            await connection.query('DELETE FROM historico WHERE usuarios_idusuarios = ?', [id]);
            await connection.query('DELETE FROM favoritos WHERE usuarios_idusuarios = ?', [id]);
            await connection.query('DELETE FROM auditoria WHERE usuarios_idusuarios = ?', [id]);

            // 4. Apagar os áudios que o usuário criou
            await connection.query('DELETE FROM audios WHERE usuarios_idusuarios = ?', [id]);

            // 5. Finalmente, deletar o usuário principal
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
