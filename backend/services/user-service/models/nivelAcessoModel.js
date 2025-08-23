const pool = require('../db/connections');

const NivelAcesso = {
    getAll: async () => {
        const [rows] = await pool.query('SELECT * FROM nivel_acesso');
        return rows;
    },

    getById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM nivel_acesso WHERE idnivel_acesso = ?', [id]);
        return rows[0];
    },

    create: async ({ idnivel_acesso, nome }) => {
        const [result] = await pool.query(
            'INSERT INTO nivel_acesso (idnivel_acesso, nome) VALUES (?, ?)',
            [idnivel_acesso, nome]
        );
        return { idnivel_acesso: result.insertId, nome };
    },

    update: async (id, { nome }) => {
        const [result] = await pool.query(
            'UPDATE nivel_acesso SET nome = ? WHERE idnivel_acesso = ?',
            [nome, id]
        );
        return result.affectedRows > 0;
    },

    delete: async (id) => {
        const [result] = await pool.query('DELETE FROM nivel_acesso WHERE idnivel_acesso = ?', [id]);
        return result.affectedRows > 0;
    }
};

module.exports = NivelAcesso;