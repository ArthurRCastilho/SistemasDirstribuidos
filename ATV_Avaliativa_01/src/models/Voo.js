const mongoose = require('mongoose');
const { Schema } = mongoose;

const vooSchema = new Schema({
    numeroVoo: {
        type: Number,
        required: [true, 'O número do Voo é obrigatorio'],
        min: [0, 'O número do voo não pode ser negativo'],
        unique: true
    },
    origem: {
        type: String,
        required: [true, 'A origem é obrigatoria'],
        trim: true
    },
    destino: {
        type: String,
        required: [true, 'O destino é obrigatoria'],
        trim: true
    },
    dataHoraPartida: {
        type: Date,
        required: [true, 'A data e hora de partida são obrigatórias']
    },
    status: {
        type: String,
        enum: ['programado', 'embarque', 'concluido', 'cancelado'],
        default: 'programado'
    },
    portaoId: {
        type: Schema.Types.ObjectId,
        ref: 'PortaoEmbarque',
        required: [true, 'O portão é obrigatório']
    }
}, {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true }
});

// Middleware para atualizar disponibilidade do portão
vooSchema.pre('save', async function(next) {
    try {
        const PortaoEmbarque = mongoose.model('PortaoEmbarque');
        
        // Se o portão foi modificado
        if (this.isModified('portaoId')) {
            // Se houver um portão anterior, libera ele
            if (this._oldPortaoId) {
                await PortaoEmbarque.findByIdAndUpdate(this._oldPortaoId, { disponivel: true });
            }
            // Marca o novo portão como indisponível
            await PortaoEmbarque.findByIdAndUpdate(this.portaoId, { disponivel: false });
        }
        
        // Se o status foi modificado para concluído ou cancelado
        if (this.isModified('status') && (this.status === 'concluido' || this.status === 'cancelado')) {
            if (this.portaoId) {
                await PortaoEmbarque.findByIdAndUpdate(this.portaoId, { disponivel: true });
            }
        }
        
        // Armazena o portão atual para a próxima atualização
        this._oldPortaoId = this.portaoId;
        
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('Voo', vooSchema); 