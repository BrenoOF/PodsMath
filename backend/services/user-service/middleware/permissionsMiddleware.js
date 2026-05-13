const pool = require('../db/connections');

const permissionsMiddleware = (permissaoRequerida) => {
    return async (req, res, next) => {
        try {
            // Pega o ID do usuário que foi injetado pelo middleware de autenticação
            const idUsuario = req.usuario?.idusuarios;

            if (!idUsuario) {
                return res.status(401).json({ message: 'Usuário não autenticado. Faça login primeiro.' });
            }

            // A query faz o caminho: usuarios -> nivel_acesso -> categoria_nivel_acesso -> config_nivel_acesso
            const query = `
                SELECT conf.nomeconfig
                FROM usuarios u
                JOIN nivel_acesso n ON u.nivel_acesso_idnivel_acesso = n.idnivel_acesso
                JOIN categoria_nivel_acesso cat ON n.idnivel_acesso = cat.idnivel_acesso
                JOIN config_nivel_acesso conf ON cat.idcategoria = conf.idcategoria
                WHERE u.idusuarios = ? AND conf.nomeconfig = ?
            `;

            // Executa a busca no banco
            const [linhas] = await pool.execute(query, [idUsuario, permissaoRequerida]);

            // Se a query retornou algo, o usuário tem a configuração de acesso vinculada ao seu nível
            if (linhas.length > 0) {
                return next(); // Sinal verde! Vai para a rota.
            } else {
                return res.status(403).json({ message: 'Acesso negado: Você não tem permissão para realizar esta ação.' });
            }

        } catch (erro) {
            console.error('Erro no middleware de permissões:', erro);
            return res.status(500).json({ message: 'Erro interno do servidor ao verificar permissões.' });
        }
    };
};

module.exports = permissionsMiddleware;
