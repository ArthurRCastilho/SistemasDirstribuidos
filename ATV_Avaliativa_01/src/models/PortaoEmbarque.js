const mongoose = require('mongoose');
const { Schema } = mongoose;

const portaoEmbarqueSchema = new Schema({
    codigo: {
        type: String,
        required: [true, 'O código do Voo é obrigatorio'],
        trim: true
    },
    disponivel: {
        type: Boolean,
        required: [true, 'Disponibilidade é obrigatorio'],
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('PortaoEmbarque', portaoEmbarqueSchema); 