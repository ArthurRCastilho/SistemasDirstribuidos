const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Definir a rota para obter todos os usuários
router.get('/users', userController.getALLUsers);

module.exports = router;
