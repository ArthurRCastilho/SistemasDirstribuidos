const jwt = require('jsonwebtoken');
const Funcionario = require('../models/Funcionario');

// Gerar token JWT
const gerarToken = (funcionario) => {
    return jwt.sign(
        { 
            id: funcionario._id,
            nome: funcionario.nome,
            cargo: funcionario.cargo
        },
        process.env.JWT_SECRET,
        { expiresIn: '30m' }
    );
};

// Cadastro de funcionário
exports.cadastrar = async (req, res) => {
    try {
        const { nome, email, senha, cargo } = req.body;

        // Verificar se o email já está em uso
        const funcionarioExistente = await Funcionario.findOne({ email });
        if (funcionarioExistente) {
            return res.status(400).json({ message: 'Email já está em uso.' });
        }

        const funcionario = new Funcionario({
            nome,
            email,
            senha,
            cargo
        });

        await funcionario.save();

        const token = gerarToken(funcionario);

        res.status(201).json({
            message: 'Funcionário cadastrado com sucesso',
            token,
            funcionario: {
                id: funcionario._id,
                nome: funcionario.nome,
                email: funcionario.email,
                cargo: funcionario.cargo
            }
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        // Buscar funcionário pelo email
        const funcionario = await Funcionario.findOne({ email });
        if (!funcionario) {
            return res.status(401).json({ message: 'Email ou senha inválidos.' });
        }

        // Verificar senha
        const senhaValida = await funcionario.compararSenha(senha);
        if (!senhaValida) {
            return res.status(401).json({ message: 'Email ou senha inválidos.' });
        }

        const token = gerarToken(funcionario);

        res.json({
            message: 'Login realizado com sucesso',
            token,
            funcionario: {
                id: funcionario._id,
                nome: funcionario.nome,
                email: funcionario.email,
                cargo: funcionario.cargo
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 