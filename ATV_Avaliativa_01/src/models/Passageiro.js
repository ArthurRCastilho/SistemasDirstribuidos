const mongoose = require('mongoose');
const { Schema } = mongoose;

// Função para validar CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, '');
    
    if (cpf.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    // Validação do primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    let digitoVerificador1 = resto > 9 ? 0 : resto;
    
    if (digitoVerificador1 !== parseInt(cpf.charAt(9))) return false;
    
    // Validação do segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    let digitoVerificador2 = resto > 9 ? 0 : resto;
    
    return digitoVerificador2 === parseInt(cpf.charAt(10));
}

const passageiroSchema = new Schema({
    nome: {
        type: String,
        required: [true, 'O nome do passageiro é obrigatório'],
        trim: true,
        minlength: [3, 'O nome deve ter pelo menos 3 caracteres']
    },
    cpf: {
        type: String,
        required: [true, 'O cpf é obrigatório'],
        trim: true,
        unique: true,
        validate: {
            validator: validarCPF,
            message: 'CPF inválido'
        }
    },
    vooId: {
        type: Schema.Types.ObjectId,
        ref: 'Voo',
        required: [true, 'O voo é obrigatório']
    },
    statusCheckin: {
        type: String,
        enum: ['pendente', 'realizado'],
        default: 'pendente'
    }
}, {
    timestamps: true
});

// Middleware para verificar status do voo antes de permitir check-in
passageiroSchema.pre('save', async function(next) {
    if (this.isModified('statusCheckin') && this.statusCheckin === 'realizado') {
        const Voo = mongoose.model('Voo');
        const voo = await Voo.findById(this.vooId);
        
        if (!voo) {
            throw new Error('Voo não encontrado');
        }
        
        if (voo.status !== 'embarque') {
            throw new Error('Check-in só pode ser realizado quando o voo estiver em status de embarque');
        }
    }
    next();
});

module.exports = mongoose.model('Passageiro', passageiroSchema);
