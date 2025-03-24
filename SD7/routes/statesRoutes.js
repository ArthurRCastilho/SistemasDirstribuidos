const express = require('express');
const router = express.Router();
const stateController = require('../controllers/statesController');

router.get('/states', stateController.getStates); // Obter estados
router.post('/states', stateController.createState); // Criar um estado

module.exports = router;
