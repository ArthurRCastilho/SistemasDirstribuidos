const Voo = require('../models/Voo');
const Passageiro = require('../models/Passageiro');
const PortaoEmbarque = require('../models/PortaoEmbarque');

// Função auxiliar para verificar disponibilidade do portão
async function verificarDisponibilidadePortao(portaoId) {
    const portao = await PortaoEmbarque.findById(portaoId);
    if (!portao) {
        throw new Error('Portão não encontrado');
    }
    if (!portao.disponivel) {
        throw new Error('Portão já está em uso por outro voo');
    }
    return true;
}

// Criar um novo voo
exports.criarVoo = async (req, res) => {
    try {
        await verificarDisponibilidadePortao(req.body.portaoId);
        const voo = new Voo(req.body);
        await voo.save();
        res.status(201).json(voo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Listar todos os voos
exports.listarVoos = async (req, res) => {
    try {
        const voos = await Voo.find().populate('portaoId');
        res.json(voos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Buscar voo por ID
exports.buscarVooPorId = async (req, res) => {
    try {
        const voo = await Voo.findById(req.params.id).populate('portaoId');
        if (!voo) {
            return res.status(404).json({ message: 'Voo não encontrado' });
        }
        res.json(voo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Atualizar voo
exports.atualizarVoo = async (req, res) => {
    try {
        if (req.body.portaoId) {
            // Se estiver alterando o portão, verifica disponibilidade
            await verificarDisponibilidadePortao(req.body.portaoId);
            
            // Libera o portão anterior
            const vooAtual = await Voo.findById(req.params.id);
            if (vooAtual && vooAtual.portaoId) {
                await PortaoEmbarque.findByIdAndUpdate(vooAtual.portaoId, { disponivel: true });
            }
        }

        const voo = await Voo.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('portaoId');
        
        if (!voo) {
            return res.status(404).json({ message: 'Voo não encontrado' });
        }
        res.json(voo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Deletar voo
exports.deletarVoo = async (req, res) => {
    try {
        const voo = await Voo.findByIdAndDelete(req.params.id);
        if (!voo) {
            return res.status(404).json({ message: 'Voo não encontrado' });
        }
        res.json({ message: 'Voo removido com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Atualizar status do voo
exports.atualizarStatusVoo = async (req, res) => {
    try {
        const { status } = req.body;
        const voo = await Voo.findById(req.params.id);
        
        if (!voo) {
            return res.status(404).json({ message: 'Voo não encontrado' });
        }

        voo.status = status;
        await voo.save();
        
        res.json(voo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Gerar relatório diário
exports.gerarRelatorioDiario = async (req, res) => {
    try {
        let dataInicio, dataFim;
        
        // Se uma data específica for fornecida na query
        if (req.query.data) {
            // Ajusta a data para considerar o fuso horário local
            const [ano, mes, dia] = req.query.data.split('-').map(Number);
            dataInicio = new Date(ano, mes - 1, dia, 0, 0, 0, 0);
            dataFim = new Date(ano, mes - 1, dia, 23, 59, 59, 999);
        } else {
            // Se não for fornecida data, usa o dia atual
            const hoje = new Date();
            dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 0, 0, 0, 0);
            dataFim = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 23, 59, 59, 999);
        }

        // Buscar todos os voos
        const todosVoos = await Voo.find();
        
        // Log detalhado de todos os voos
        console.log('Todos os voos no banco:', todosVoos.map(v => ({
            id: v._id,
            numeroVoo: v.numeroVoo,
            dataHoraPartida: v.dataHoraPartida ? v.dataHoraPartida.toLocaleString() : 'Data não definida'
        })));

        // Log das datas de busca
        console.log('Datas de busca:', {
            inicio: dataInicio.toLocaleString(),
            fim: dataFim.toLocaleString()
        });

        // Buscar voos para a data específica
        const voos = await Voo.find({
            dataHoraPartida: {
                $gte: dataInicio,
                $lte: dataFim
            }
        }).populate('portaoId');

        // Log dos voos encontrados
        console.log('Voos encontrados:', voos.map(v => ({
            id: v._id,
            numeroVoo: v.numeroVoo,
            dataHoraPartida: v.dataHoraPartida ? v.dataHoraPartida.toLocaleString() : 'Data não definida'
        })));

        const relatorio = await Promise.all(voos.map(async (voo) => {
            const passageiros = await Passageiro.find({ vooId: voo._id });
            
            return {
                numeroVoo: voo.numeroVoo,
                origem: voo.origem,
                destino: voo.destino,
                dataHoraPartida: voo.dataHoraPartida ? voo.dataHoraPartida.toISOString() : null,
                status: voo.status,
                portao: voo.portaoId ? {
                    codigo: voo.portaoId.codigo,
                    disponivel: voo.portaoId.disponivel
                } : null,
                passageiros: passageiros.map(p => ({
                    nome: p.nome,
                    cpf: p.cpf,
                    statusCheckin: p.statusCheckin
                }))
            };
        }));

        res.json({
            data: dataInicio.toISOString().split('T')[0],
            totalVoos: relatorio.length,
            voos: relatorio,
            debug: {
                dataInicio: dataInicio.toLocaleString(),
                dataFim: dataFim.toLocaleString(),
                totalVoosNoBanco: todosVoos.length,
                voosNoBanco: todosVoos.map(v => ({
                    numeroVoo: v.numeroVoo,
                    dataHoraPartida: v.dataHoraPartida ? v.dataHoraPartida.toLocaleString() : 'Data não definida'
                }))
            }
        });
    } catch (error) {
        console.error('Erro ao gerar relatório:', error);
        res.status(500).json({ 
            message: error.message,
            stack: error.stack
        });
    }
};
