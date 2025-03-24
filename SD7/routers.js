const express = require('express');
const router = express.Router();
const userController = require("./controllers/userController");

router.get('/ping', (req, res) => {
    res.json({retorno: true});
});

//obter estados --> publica --> to do: implementar rota privada 
router.get('/states', userController.getStates);

module.exports = router;
