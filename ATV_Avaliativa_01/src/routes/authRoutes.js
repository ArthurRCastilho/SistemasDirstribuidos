const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rota de cadastro
router.post('/cadastro', authController.cadastrar);

// Rota de login
router.post('/login', authController.login);

module.exports = router; 