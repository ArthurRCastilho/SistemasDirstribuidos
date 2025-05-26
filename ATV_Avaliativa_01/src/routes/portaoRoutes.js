const express = require('express');
const router = express.Router();
const portaoController = require('../controllers/portaoController');

// Rotas de portões
router.post('/', portaoController.criarPortao);
router.get('/', portaoController.listarPortoes);
router.get('/:id', portaoController.buscarPortaoPorId);
router.patch('/:id', portaoController.atualizarPortao);
router.delete('/:id', portaoController.deletarPortao);

module.exports = router; 