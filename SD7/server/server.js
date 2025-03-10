//puxar aruqivo da aplicacao

const app = require('../app');

const mongoose = require('mongoose');

require('dotenv').config({path: 'variables.env'});

mongoose.connect(process.env.DATABASE, {useNewUrlParser: true, 
    useUnifiedTopology: true });
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (error) => {
    console.error("ERROR" + error.message);
});
//DATABASE=mongodb://127.0.0.1:27017/SD7

app.set('port', process.env.PORT || 7777);

//inicio do servidor --- observar qual porta sera selecionada

const server = app.listen(app.get('port'), () => {
    console.log("Servidor rodando na porta "
         + server.address().port);
});
