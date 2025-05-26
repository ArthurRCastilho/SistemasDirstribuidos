const Passageiro = require('../models/Passageiro');

// Criar novo passageiro
exports.criarPassageiro = async (req, res) => {
    try {
        const passageiro = new Passageiro(req.body);
        await passageiro.save();
        await passageiro.populate('vooId');
        res.status(201).json(passageiro);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Listar todos os passageiros
exports.listarPassageiros = async (req, res) => {
    try {
        const passageiros = await Passageiro.find().populate('vooId');
        res.json(passageiros);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Buscar passageiro por ID
exports.buscarPassageiroPorId = async (req, res) => {
    try {
        const passageiro = await Passageiro.findById(req.params.id).populate('vooId');
        if (!passageiro) {
            return res.status(404).json({ message: 'Passageiro não encontrado' });
        }
        res.json(passageiro);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Atualizar passageiro
exports.atualizarPassageiro = async (req, res) => {
    try {
        const passageiro = await Passageiro.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('vooId');
        
        if (!passageiro) {
            return res.status(404).json({ message: 'Passageiro não encontrado' });
        }
        res.json(passageiro);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Deletar passageiro
exports.deletarPassageiro = async (req, res) => {
    try {
        const passageiro = await Passageiro.findByIdAndDelete(req.params.id);
        if (!passageiro) {
            return res.status(404).json({ message: 'Passageiro não encontrado' });
        }
        res.json({ message: 'Passageiro removido com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fazer check-in do passageiro
exports.fazerCheckin = async (req, res) => {
    try {
        const passageiro = await Passageiro.findById(req.params.id);
        if (!passageiro) {
            return res.status(404).json({ message: 'Passageiro não encontrado' });
        }

        passageiro.statusCheckin = 'realizado';
        await passageiro.save();
        await passageiro.populate('vooId');

        res.json({
            message: 'Check-in realizado com sucesso',
            passageiro
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}; 