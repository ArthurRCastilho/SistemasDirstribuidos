const PortaoEmbarque = require('../models/PortaoEmbarque');

// Criar um novo portão
exports.criarPortao = async (req, res) => {
    try {
        const portao = new PortaoEmbarque(req.body);
        await portao.save();
        res.status(201).json(portao);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Listar todos os portões
exports.listarPortoes = async (req, res) => {
    try {
        const portoes = await PortaoEmbarque.find();
        res.json(portoes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Buscar portão por ID
exports.buscarPortaoPorId = async (req, res) => {
    try {
        const portao = await PortaoEmbarque.findById(req.params.id);
        if (!portao) {
            return res.status(404).json({ message: 'Portão não encontrado' });
        }
        res.json(portao);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Atualizar portão
exports.atualizarPortao = async (req, res) => {
    try {
        const portao = await PortaoEmbarque.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!portao) {
            return res.status(404).json({ message: 'Portão não encontrado' });
        }
        res.json(portao);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Deletar portão
exports.deletarPortao = async (req, res) => {
    try {
        const portao = await PortaoEmbarque.findByIdAndDelete(req.params.id);
        if (!portao) {
            return res.status(404).json({ message: 'Portão não encontrado' });
        }
        res.json({ message: 'Portão removido com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 