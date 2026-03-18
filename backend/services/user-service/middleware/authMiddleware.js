const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    let token = null;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }
    else if (req.query.token) {
        token = req.query.token;
    }

    if (!token || token === 'null' || token === 'undefined') {
        return res.status(401).json({ message: 'Token de autenticação não fornecido ou inválido' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'chave-secreta-padrao');
        req.usuario = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Falha na autenticação do token' });
    }
};

module.exports = authMiddleware;
