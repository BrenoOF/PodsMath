const pool = require('../db/connections');

const Transcricao = {
    getAll: async () => {
        const [rows] = await pool.query('SELECT * FROM transcricao');
        return rows;
    },

    getById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM transcricao WHERE idTranscricao = ?', [id]);
        return rows[0];
    },

    create: async ({ textoTranscricao, audios_idaudios, idiomas_ididiomas }) => {
        const [result] = await pool.query(
            'INSERT INTO transcricao (textoTranscricao, audios_idaudios, idiomas_ididiomas) VALUES (?, ?, ?)',
            [textoTranscricao, audios_idaudios, idiomas_ididiomas]
        );
        return { idTranscricao: result.insertId, textoTranscricao, audios_idaudios, idiomas_ididiomas };
    },

    update: async (id, { textoTranscricao, audios_idaudios, idiomas_ididiomas }) => {
        const [result] = await pool.query(
            'UPDATE transcricao SET textoTranscricao = ?, audios_idaudios = ?, idiomas_ididiomas = ? WHERE idTranscricao = ?',
            [textoTranscricao, audios_idaudios, idiomas_ididiomas, id]
        );
        return result.affectedRows > 0;
    },

    delete: async (id) => {
        const [result] = await pool.query('DELETE FROM transcricao WHERE idTranscricao = ?', [id]);
        return result.affectedRows > 0;
    }
};

module.exports = Transcricao;