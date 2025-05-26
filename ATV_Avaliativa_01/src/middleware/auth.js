const jwt = require('jsonwebtoken');
const Funcionario = require('../models/Funcionario');

// Middleware para verificar se o usuário está autenticado
exports.autenticar = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const funcionario = await Funcionario.findById(decoded.id);

        if (!funcionario) {
            return res.status(401).json({ message: 'Usuário não encontrado.' });
        }

        req.funcionario = funcionario;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido ou expirado.' });
    }
};

// Middleware para verificar se o usuário é admin (apenas para operações de escrita)
exports.verificarAdmin = (req, res, next) => {
    // Se for uma operação de leitura (GET), permite qualquer usuário autenticado
    if (req.method === 'GET') {
        return next();
    }

    // Para outras operações (POST, PATCH, DELETE), verifica se é admin
    if (req.funcionario.cargo !== 'admin') {
        return res.status(403).json({ 
            message: 'Acesso negado. Apenas administradores podem realizar esta ação.' 
        });
    }
    next();
}; 