const pool = require('../db/connections');

const Auditoria = {
    getAll: async () => {
        const [rows] = await pool.query('SELECT * FROM auditoria');
        return rows;
    },

    getById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM auditoria WHERE idauditoria = ?', [id]);
        return rows[0];
    },

    create: async ({ idauditoria, usuarios_idusuarios, mensagem, dataHora }) => {
        const [result] = await pool.query(
            'INSERT INTO auditoria (idauditoria, usuarios_idusuarios, mensagem, dataHora) VALUES (?, ?, ?, ?)',
            [idauditoria, usuarios_idusuarios, mensagem, dataHora]
        );
        return { idauditoria: result.insertId, usuarios_idusuarios, mensagem, dataHora };
    },

    update: async (id, { usuarios_idusuarios, mensagem, dataHora }) => {
        const [result] = await pool.query(
            'UPDATE auditoria SET usuarios_idusuarios = ?, mensagem = ?, dataHora = ? WHERE idauditoria = ?',
            [usuarios_idusuarios, mensagem, dataHora, id]
        );
        return result.affectedRows > 0;
    },

    delete: async (id) => {
        const [result] = await pool.query('DELETE FROM auditoria WHERE idauditoria = ?', [id]);
        return result.affectedRows > 0;
    }
};

module.exports = Auditoria;