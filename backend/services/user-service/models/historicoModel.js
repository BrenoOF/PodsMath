const pool = require('../db/connections');

const Historico = {
    getAll: async () => {
        const [rows] = await pool.query('SELECT * FROM historico');
        return rows;
    },

    getById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM historico WHERE idhistorico = ?', [id]);
        return rows[0];
    },

    create: async ({ idhistorico, usuarios_idusuarios, audios_idaudios, tempo_audio }) => {
        const [result] = await pool.query(
            'INSERT INTO historico (idhistorico, usuarios_idusuarios, audios_idaudios, tempo_audio) VALUES (?, ?, ?, ?)',
            [idhistorico, usuarios_idusuarios, audios_idaudios, tempo_audio]
        );
        return { idhistorico: result.insertId, usuarios_idusuarios, audios_idaudios, tempo_audio };
    },

    update: async (id, { usuarios_idusuarios, audios_idaudios, tempo_audio }) => {
        const [result] = await pool.query(
            'UPDATE historico SET usuarios_idusuarios = ?, audios_idaudios = ?, tempo_audio = ? WHERE idhistorico = ?',
            [usuarios_idusuarios, audios_idaudios, tempo_audio, id]
        );
        return result.affectedRows > 0;
    },

    delete: async (id) => {
        const [result] = await pool.query('DELETE FROM historico WHERE idhistorico = ?', [id]);
        return result.affectedRows > 0;
    }
};

module.exports = Historico;