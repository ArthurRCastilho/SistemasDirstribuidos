const mongoose = require('mongoose');
const Category = require('../models/category'); // Certifique-se de que está importando corretamente

module.exports = {
    getCategory: async (req, res) => {
        try {
            let categories = await Category.find(); // Use "Category" com letra maiúscula
            res.json({ categories });
        } catch (error) {
            res.status(500).json({ error: "Erro ao buscar categorias" });
        }
    }
};
