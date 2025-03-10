const express = require ('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Ola Mundo');
});

//configuracoes basicas
//inicializar o express
const app = express();
app.use('/', router);

//exportar app para importar no servidor
module.exports = app;