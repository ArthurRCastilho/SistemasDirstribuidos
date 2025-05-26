const express = require('express');
const router = express.Router();
const passageiroController = require('../controllers/passageiroController');

// Rotas de passageiros
router.post('/', passageiroController.criarPassageiro);
router.get('/', passageiroController.listarPassageiros);
router.get('/:id', passageiroController.buscarPassageiroPorId);
router.patch('/:id', passageiroController.atualizarPassageiro);
router.delete('/:id', passageiroController.deletarPassageiro);

// Rota específica para check-in
router.patch('/:id/checkin', passageiroController.fazerCheckin);

module.exports = router; 