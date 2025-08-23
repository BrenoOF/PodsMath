const pool = require('../db/connections');

const Idioma = {
    getAll: async () => {
        const [rows] = await pool.query('SELECT * FROM idiomas');
        return rows;
    },

    getById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM idiomas WHERE ididiomas = ?', [id]);
        return rows[0];
    },

    create: async ({ nomeIdiomas, imagens_idimagens }) => {
        const [result] = await pool.query(
            'INSERT INTO idiomas (nomeIdiomas, imagens_idimagens) VALUES (?, ?)',
            [nomeIdiomas, imagens_idimagens]
        );
        return { ididiomas: result.insertId, nomeIdiomas, imagens_idimagens };
    },

    update: async (id, { nomeIdiomas, imagens_idimagens }) => {
        const [result] = await pool.query(
            'UPDATE idiomas SET nomeIdiomas = ?, imagens_idimagens = ? WHERE ididiomas = ?',
            [nomeIdiomas, imagens_idimagens, id]
        );
        return result.affectedRows > 0;
    },

    delete: async (id) => {
        const [result] = await pool.query('DELETE FROM idiomas WHERE ididiomas = ?', [id]);
        return result.affectedRows > 0;
    }
};

module.exports = Idioma;