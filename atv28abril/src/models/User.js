const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    nome: {
        type: String,
        required: [true, 'O nome é obrigatório'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'O email é obrigatório'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
    },
    senha: {
        type: String,
        required: [true, 'A senha é obrigatória'],
        minlength: [6, 'A senha deve ter no mínimo 6 caracteres']
    },
    endereco: {
        type: Schema.Types.ObjectId,
        ref: 'Endereco',
        required: [true, 'O endereço é obrigatório']
    },
    telefone: {
        type: String,
        required: [true, 'O telefone é obrigatório'],
        match: [/^\(\d{2}\) \d{5}-\d{4}$/, 'Formato de telefone inválido']
    },
    cargo: {
        type: Schema.Types.ObjectId,
        ref: 'Cargo',
        required: [true, 'O cargo é obrigatório']
    },
    departamento: {
        type: Schema.Types.ObjectId,
        ref: 'Departamento',
        required: [true, 'O departamento é obrigatório']
    },
    dataNascimento: {
        type: Date,
        required: [true, 'A data de nascimento é obrigatória']
    },
    ativo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema); 