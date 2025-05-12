const mongoose = require('mongoose');
const { Schema } = mongoose;

const departamentoSchema = new Schema({
    nome: {
        type: String,
        required: [true, 'O nome do departamento é obrigatório'],
        trim: true,
        unique: true
    },
    descricao: {
        type: String,
        required: [true, 'A descrição do departamento é obrigatória'],
        trim: true
    },
    orcamento: {
        type: Number,
        required: [true, 'O orçamento do departamento é obrigatório'],
        min: [0, 'O orçamento não pode ser negativo']
    },
    responsavel: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Departamento', departamentoSchema); 