const pool = require('../db/connections');

const Imagem = {
    getAll: async () => {
        const [rows] = await pool.query('SELECT * FROM imagens');
        return rows;
    },

    getById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM imagens WHERE idimagens = ?', [id]);
        return rows[0];
    },

    create: async ({ idimagens, caminho_imagem }) => {
        const [result] = await pool.query(
            'INSERT INTO imagens (idimagens, caminho_imagem) VALUES (?, ?)',
            [idimagens, caminho_imagem]
        );
        return { idimagens: result.insertId, caminho_imagem };
    },

    update: async (id, { caminho_imagem }) => {
        const [result] = await pool.query(
            'UPDATE imagens SET caminho_imagem = ? WHERE idimagens = ?',
            [caminho_imagem, id]
        );
        return result.affectedRows > 0;
    },

    delete: async (id) => {
        const [result] = await pool.query('DELETE FROM imagens WHERE idimagens = ?', [id]);
        return result.affectedRows > 0;
    }
};

module.exports = Imagem;