const mongoose = require('mongoose');
const { Schema } = mongoose;

const enderecoSchema = new Schema({
    rua: {
        type: String,
        required: [true, 'A rua é obrigatória'],
        trim: true
    },
    numero: {
        type: String,
        required: [true, 'O número é obrigatório']
    },
    complemento: {
        type: String,
        trim: true
    },
    bairro: {
        type: String,
        required: [true, 'O bairro é obrigatório'],
        trim: true
    },
    cidade: {
        type: String,
        required: [true, 'A cidade é obrigatória'],
        trim: true
    },
    estado: {
        type: String,
        required: [true, 'O estado é obrigatório'],
        trim: true,
        uppercase: true,
        minlength: [2, 'O estado deve ter 2 caracteres'],
        maxlength: [2, 'O estado deve ter 2 caracteres']
    },
    cep: {
        type: String,
        required: [true, 'O CEP é obrigatório'],
        match: [/^\d{5}-\d{3}$/, 'Formato de CEP inválido']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Endereco', enderecoSchema); 