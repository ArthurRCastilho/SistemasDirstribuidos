const State = require('../models/States');

// Buscar todos os estados
exports.getStates = async (req, res) => {
    try {
        const states = await State.find();
        res.json(states);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar estados", error });
    }
};

// Criar um novo estado
exports.createState = async (req, res) => {
    try {
        const { name, abbreviation } = req.body;
        const newState = new State({ name, abbreviation });

        await newState.save();
        res.status(201).json(newState);
    } catch (error) {
        res.status(500).json({ message: "Erro ao criar estado", error });
    }
};
