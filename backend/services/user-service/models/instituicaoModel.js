const pool = require('../db/connections');

const Instituicao = {
    getAll: async () => {
        const [rows] = await pool.query('SELECT * FROM instituicoes');
        return rows;
    },

    getById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM instituicoes WHERE idinstituicoes = ?', [id]);
        return rows[0];
    },

    create: async ({ idinstituicoes, imagens_idimagens, nome }) => {
        const [result] = await pool.query(
            'INSERT INTO instituicoes (idinstituicoes, imagens_idimagens, nome) VALUES (?, ?, ?)',
            [idinstituicoes, imagens_idimagens, nome]
        );
        return { idinstituicoes: result.insertId, imagens_idimagens, nome };
    },

    update: async (id, { imagens_idimagens, nome }) => {
        const [result] = await pool.query(
            'UPDATE instituicoes SET imagens_idimagens = ?, nome = ? WHERE idinstituicoes = ?',
            [imagens_idimagens, nome, id]
        );
        return result.affectedRows > 0;
    },

    delete: async (id) => {
        const [result] = await pool.query('DELETE FROM instituicoes WHERE idinstituicoes = ?', [id]);
        return result.affectedRows > 0;
    }
};

module.exports = Instituicao;