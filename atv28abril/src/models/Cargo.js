const mongoose = require('mongoose');
const { Schema } = mongoose;

const cargoSchema = new Schema({
    nome: {
        type: String,
        required: [true, 'O nome do cargo é obrigatório'],
        trim: true,
        unique: true
    },
    descricao: {
        type: String,
        required: [true, 'A descrição do cargo é obrigatória'],
        trim: true
    },
    salarioBase: {
        type: Number,
        required: [true, 'O salário base é obrigatório'],
        min: [0, 'O salário base não pode ser negativo']
    },
    nivel: {
        type: String,
        required: [true, 'O nível do cargo é obrigatório'],
        enum: ['Júnior', 'Pleno', 'Sênior', 'Especialista']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Cargo', cargoSchema); 