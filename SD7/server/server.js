const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const fileupload = require('express-fileupload');
require('dotenv').config({ path: 'variables.env' });

const apiRouters = require('../routers');

// Conectar ao banco de dados
mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (error) => {
    console.error("ERRO: " + error.message);
});

// Criar instância do Express
const server = express();

// Configurar middlewares
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(fileupload());
server.use('/', apiRouters);

// Definir a porta corretamente
const PORT = process.env.PORT || 7778;

server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
