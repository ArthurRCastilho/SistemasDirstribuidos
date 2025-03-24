const express = require('express');
const cors = require('cors');
const fileupload = require('express-fileupload');
require('dotenv').config({ path: 'variables.env' });

const mongoose = require('mongoose');
const userRoutes = require('../routes/usersRoutes');
const statesRoutes = require("../routes/statesRoutes");
const adsRoutes = require('../routes/adsRoutes')
const categoryRoutes = require('../routes/categoryRoutes')

const server = express();

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(fileupload());

// Conectar ao banco de dados
mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (error) => {
    console.error("ERRO: " + error.message);
});

// Definir rotas organizadas
server.use('/api', statesRoutes);
server.use('/api', userRoutes);
server.use('/api', adsRoutes);
server.use('/api', categoryRoutes);

// Iniciar o servidor
const PORT = process.env.PORT || 7778;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
