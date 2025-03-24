const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {

    res.send('Ola mundo');
});

// Configurações básicas
// Inicializar o express
const app = express();
app.use('/', router);

// Exportar o app para importar no servidor
module.exports = app;