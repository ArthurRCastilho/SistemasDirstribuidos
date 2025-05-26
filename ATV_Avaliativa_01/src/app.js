const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Middleware para debug
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Conexão com o MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aeroporto')
    .then(() => console.log('Conectado ao MongoDB'))
    .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Importar rotas
const authRoutes = require('./routes/authRoutes');
const vooRoutes = require('./routes/flightRoutes');
const portaoRoutes = require('./routes/portaoRoutes');
const passageiroRoutes = require('./routes/passengerRoutes');

// Middleware de autenticação
const { autenticar, verificarAdmin } = require('./middleware/auth');

// Rotas públicas
app.use('/api/auth', authRoutes);

// Rotas protegidas
app.use('/api/voos', autenticar, verificarAdmin, vooRoutes);
app.use('/api/portoes', autenticar, verificarAdmin, portaoRoutes);
app.use('/api/passageiros', autenticar, verificarAdmin, passageiroRoutes);

// Rota de teste
app.get('/teste', (req, res) => {
    res.json({ message: 'API está funcionando!' });
});

// Tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Erro interno do servidor' });
});

// Tratamento de rotas não encontradas
app.use((req, res) => {
    res.status(404).json({ message: 'Rota não encontrada' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
}); 