const express = require('express');
const router = express.Router();
const adsController = require('../controllers/adsController');

// Definir a rota para obter todos os usuários
router.get('/ads', adsController.getAds);

module.exports = router;