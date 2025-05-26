const express = require('express');
const router = express.Router();
const vooController = require('../controllers/vooController');

// Rotas de voos
router.post('/', vooController.criarVoo);
router.get('/', vooController.listarVoos);
router.get('/:id', vooController.buscarVooPorId);
router.patch('/:id', vooController.atualizarVoo);
router.delete('/:id', vooController.deletarVoo);

// Rota específica para atualizar status
router.patch('/:id/status', vooController.atualizarStatusVoo);

module.exports = router; 