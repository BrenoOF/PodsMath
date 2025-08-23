const pool = require('../db/connections');

const Usuario = {
    getAll: async () => {
        const [rows] = await pool.query('SELECT * FROM usuarios');
        return rows;
    },

    getById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE idusuarios = ?', [id]);
        return rows[0];
    },

    create: async (usuarioData) => {
        const { idusuarios, instituicoes_idinstituicoes, nome, email, senha, id_usuario_professor, nivel_acesso_idnivel_acesso, paletaCor_idpaletaCor, audiosEscutados } = usuarioData;
        const [result] = await pool.query(
            'INSERT INTO usuarios (idusuarios, instituicoes_idinstituicoes, nome, email, senha, id_usuario_professor, nivel_acesso_idnivel_acesso, paletaCor_idpaletaCor, audiosEscutados) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [idusuarios, instituicoes_idinstituicoes, nome, email, senha, id_usuario_professor, nivel_acesso_idnivel_acesso, paletaCor_idpaletaCor, audiosEscutados]
        );
        return { idusuarios: result.insertId, ...usuarioData };
    },

    update: async (id, usuarioData) => {
        const { instituicoes_idinstituicoes, nome, email, senha, id_usuario_professor, nivel_acesso_idnivel_acesso, paletaCor_idpaletaCor, audiosEscutados } = usuarioData;
        const [result] = await pool.query(
            'UPDATE usuarios SET instituicoes_idinstituicoes = ?, nome = ?, email = ?, senha = ?, id_usuario_professor = ?, nivel_acesso_idnivel_acesso = ?, paletaCor_idpaletaCor = ?, audiosEscutados = ? WHERE idusuarios = ?',
            [instituicoes_idinstituicoes, nome, email, senha, id_usuario_professor, nivel_acesso_idnivel_acesso, paletaCor_idpaletaCor, audiosEscutados, id]
        );
        return result.affectedRows > 0;
    },

    delete: async (id) => {
        const [result] = await pool.query('DELETE FROM usuarios WHERE idusuarios = ?', [id]);
        return result.affectedRows > 0;
    }
};

module.exports = Usuario;