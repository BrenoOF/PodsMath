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
            const query = `
                SELECT 
                    h.*, 
                    a.titulo, 
                    a.descricao, 
                    a.temas_idtemas AS idTema,
                    t.titulo AS assunto,
                    t.categorias_idcategorias AS playlistTema,
                    img.caminho_imagem AS imagem_caminho
                FROM historico h
                JOIN audios a ON h.audios_idaudios = a.idaudios
                LEFT JOIN temas t ON a.temas_idtemas = t.idtemas
                LEFT JOIN imagens img ON a.imagens_idimagens = img.idimagens
                WHERE h.usuarios_idusuarios = ?
                ORDER BY h.idhistorico DESC
            `;
            const [rows] = await connection.query(query, [usuarioId]);
            await connection.commit();
            return rows;
        } catch (error) {
            if (connection) await connection.rollback();
            throw error;
        } finally {
            if (connection) connection.release();
        }
    },

    getByUsuarioAndAudio: async (usuarioId, audioId) => {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const [rows] = await connection.query(
                'SELECT * FROM historico WHERE usuarios_idusuarios = ? AND audios_idaudios = ?',
                [usuarioId, audioId]
            );
            await connection.commit();
            return rows[0];
        } catch (error) {
            if (connection) await connection.rollback();
            throw error;
        } finally {
            if (connection) connection.release();
        }
    },

    upsert: async ({ usuarios_idusuarios, audios_idaudios, tempo_audio }) => {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();
            
            // Verifica se já existe
            const [existing] = await connection.query(
                'SELECT idhistorico FROM historico WHERE usuarios_idusuarios = ? AND audios_idaudios = ?',
                [usuarios_idusuarios, audios_idaudios]
            );

            if (existing.length > 0) {
                // Update
                await connection.query(
                    'UPDATE historico SET tempo_audio = ? WHERE idhistorico = ?',
                    [tempo_audio, existing[0].idhistorico]
                );
                await connection.commit();
                return { idhistorico: existing[0].idhistorico, usuarios_idusuarios, audios_idaudios, tempo_audio, action: 'updated' };
            } else {
                // Insert
                const [result] = await connection.query(
                    'INSERT INTO historico (usuarios_idusuarios, audios_idaudios, tempo_audio) VALUES (?, ?, ?)',
                    [usuarios_idusuarios, audios_idaudios, tempo_audio]
                );
                await connection.commit();
                return { idhistorico: result.insertId, usuarios_idusuarios, audios_idaudios, tempo_audio, action: 'created' };
            }
        } catch (error) {
            if (connection) await connection.rollback();
            throw error;
        } finally {
            if (connection) connection.release();
        }
    },

    create: async ({ usuarios_idusuarios, audios_idaudios, tempo_audio }) => {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const [result] = await connection.query(
                'INSERT INTO historico (usuarios_idusuarios, audios_idaudios, tempo_audio) VALUES (?, ?, ?)',
                [usuarios_idusuarios, audios_idaudios, tempo_audio]
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
