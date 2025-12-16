const pool = require('../db/connections');

const PaletaCor = {
    getAll: async () => {
        const [rows] = await pool.query('SELECT * FROM paletacor');
        return rows;
    },

    getById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM paletacor WHERE idpaletaCor = ?', [id]);
        return rows[0];
    },

    create: async ({ idpaletaCor, nome, ativado }) => {
        const [result] = await pool.query(
            'INSERT INTO paletacor (idpaletaCor, nome, ativado) VALUES (?, ?, ?)',
            [idpaletaCor, nome, ativado]
        );
        return { idpaletaCor: result.insertId, nome, ativado };
    },

    update: async (id, { nome, ativado }) => {
        const [result] = await pool.query(
            'UPDATE paletacor SET nome = ?, ativado = ? WHERE idpaletaCor = ?',
            [nome, ativado, id]
        );
        return result.affectedRows > 0;
    },

    delete: async (id) => {
        const [result] = await pool.query('DELETE FROM paletacor WHERE idpaletaCor = ?', [id]);
        return result.affectedRows > 0;
    }
};

module.exports = PaletaCor;