const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuarioModel');

const authController = {
    login: async (req, res) => {
        try {
            const { email, senha } = req.body;

            if (!email || !senha) {
                return res.status(400).json({ message: 'Email e senha são obrigatórios' });
            }

            const usuario = await Usuario.findByEmail(email);
            if (!usuario) {
                return res.status(401).json({ message: 'Credenciais inválidas' });
            }

            const isMatch = await bcrypt.compare(senha, usuario.senha);
            if (!isMatch) {
                return res.status(401).json({ message: 'Credenciais inválidas' });
            }

            const payload = {
                idusuarios: usuario.idusuarios,
                nome: usuario.nome,
                email: usuario.email,
                instituicoes_idinstituicoes: usuario.instituicoes_idinstituicoes,
                id_usuario_professor: usuario.id_usuario_professor,
                nivel_acesso_idnivel_acesso: usuario.nivel_acesso_idnivel_acesso,
                paletaCor_idpaletaCor: usuario.paletaCor_idpaletaCor,
                audiosEscutados: usuario.audiosEscutados
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET || 'chave-secreta-padrao', { expiresIn: '1d' });

            res.json({ message: 'Login realizado com sucesso', token, usuario: payload });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = authController;
