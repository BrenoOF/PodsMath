const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuarioModel');
const emailService = require('../services/emailService');

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
        nivel_acesso: usuario.nome_nivel_acesso,
        paletaCor_idpaletaCor: usuario.paletaCor_idpaletaCor,
        audiosEscutados: usuario.audiosEscutados
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET || 'chave-secreta-padrao', { expiresIn: '1d' });

      res.json({ message: 'Login realizado com sucesso', token, usuario: payload });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  register: async (req, res) => {
    try {
      const { nome, email, senha, instituicoes_idinstituicoes } = req.body;

      // Validação de campos obrigatórios
      if (!nome || !email || !senha) {
        return res.status(400).json({ message: 'Nome, email e senha são obrigatórios' });
      }

      // Verifica se email já existe
      const existingUser = await Usuario.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: 'Email já cadastrado' });
      }

      // Hash da senha
      const senhaHash = await bcrypt.hash(senha, 10);

      // Cria o usuário com defaults para FKs obrigatórias
      const createdUser = await Usuario.create({
        nome,
        email,
        senha: senhaHash,
        instituicoes_idinstituicoes: instituicoes_idinstituicoes || null,
        id_usuario_professor: null,
        nivel_acesso_idnivel_acesso: req.body.nivel_acesso_idnivel_acesso || 1,
        paletaCor_idpaletaCor: req.body.paletaCor_idpaletaCor || 1,
        audiosEscutados: 0,
        imagens_idimagens: req.body.imagens_idimagens || 1
      });

      // Busca o usuário completo para obter o nome do nível de acesso
      const usuario = await Usuario.getById(createdUser.idusuarios);

      // Gera token JWT
      const payload = {
        idusuarios: usuario.idusuarios,
        nome: usuario.nome,
        email: usuario.email,
        instituicoes_idinstituicoes: usuario.instituicoes_idinstituicoes,
        id_usuario_professor: usuario.id_usuario_professor,
        nivel_acesso: usuario.nome_nivel_acesso,
        paletaCor_idpaletaCor: usuario.paletaCor_idpaletaCor,
        audiosEscutados: usuario.audiosEscutados
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET || 'chave-secreta-padrao', { expiresIn: '1d' });

      res.status(201).json({
        message: 'Usuário cadastrado com sucesso',
        token,
        usuario: payload
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: 'Email é obrigatório' });
      }

      // Verifica se o usuário existe
      const usuario = await Usuario.findByEmail(email);
      if (!usuario) {
        // Não revelar que o email não existe por segurança
        return res.json({ message: 'Se o email estiver cadastrado, você receberá instruções para redefinir sua senha' });
      }

      // Gera token JWT válido por 30 minutos para reset de senha
      const resetToken = jwt.sign(
        {
          email: usuario.email,
          tipo: 'reset_senha',
          idusuarios: usuario.idusuarios
        },
        process.env.JWT_SECRET || 'chave-secreta-padrao',
        { expiresIn: '30m' }
      );

      // Obtém o IP do solicitante
      const ipOrigem = req.ip || req.connection.remoteAddress;

      // Cria link de reset com o token
      const linkResetSenha = `${process.env.USER_SERVICE_URL || 'http://localhost:3001'}/auth/reset-password/${resetToken}`;

      // Envia email de redefinição
      await emailService.sendPasswordResetEmail(
        usuario.email,
        usuario.nome,
        linkResetSenha,
        ipOrigem
      );

      res.json({ message: 'Se o email estiver cadastrado, você receberá instruções para redefinir sua senha' });
    } catch (error) {
      console.error('Erro ao solicitar reset de senha:', error);
      res.status(500).json({ message: error.message });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { token } = req.params;
      const { senha } = req.body;

      if (!token || !senha) {
        return res.status(400).json({ message: 'Token e senha são obrigatórios' });
      }

      // Verifica e decodifica o token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'chave-secreta-padrao');

      // Verifica se é um token de reset de senha
      if (decoded.tipo !== 'reset_senha') {
        return res.status(400).json({ message: 'Token inválido' });
      }

      // Verifica se o usuário existe
      const usuario = await Usuario.findByEmail(decoded.email);
      if (!usuario) {
        return res.status(400).json({ message: 'Token inválido' });
      }

      // Hash da nova senha
      const senhaHash = await bcrypt.hash(senha, 10);

      // Atualiza a senha do usuário
      const result = await Usuario.update(usuario.idusuarios, {
        ...usuario,
        senha: senhaHash
      });

      if (!result) {
        return res.status(500).json({ message: 'Erro ao atualizar senha' });
      }

      res.json({ message: 'Senha redefinida com sucesso' });
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(400).json({ message: 'Token expirado' });
      }
      if (error.name === 'JsonWebTokenError') {
        return res.status(400).json({ message: 'Token inválido' });
      }
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = authController;
