const pool = require('../db/connections');

const Tema = {
    getAll: async () => {
        const [rows] = await pool.query('SELECT * FROM temas');
        return rows;
    },

    getById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM temas WHERE idtemas = ?', [id]);
        return rows[0];
    },

    create: async ({ titulo }) => {
        const [result] = await pool.query(
            'INSERT INTO temas (titulo) VALUES (?)',
            [titulo]
        );
        return { idtemas: result.insertId, titulo };
    },

    update: async (id, { titulo }) => {
        const [result] = await pool.query(
            'UPDATE temas SET titulo = ? WHERE idtemas = ?',
            [titulo, id]
        );
        return result.affectedRows > 0;
    },

    delete: async (id) => {
        const [result] = await pool.query('DELETE FROM temas WHERE idtemas = ?', [id]);
        return result.affectedRows > 0;
    }
};


module.exports = Tema;