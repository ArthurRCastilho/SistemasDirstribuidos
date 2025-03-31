const mongoose = require('mongoose');
const Category = require('../models/category'); // Certifique-se de que está importando corretamente
const {validationResult, matchedData} = require('express-validator')

module.exports = {
    getCategory: async (req, res) => {
        try {
            let categories = await Category.find(); // Use "Category" com letra maiúscula
            res.json({ categories });
        } catch (error) {
            res.status(500).json({ error: "Erro ao buscar categorias" });
        }
    },

    editCategory: async (req, res) => {
        const erros = validationResult(req);
        if(!erros.isEmpty()) { // Identifica erros ao inserir os dados no banco de dados
            req.json({
                error: erros.mapped()
            });
            return;
        }

        const data = matchedData(req);
        let updates = {};

        if(data.name || data.slug) {
            updates.name = data.name
            updates.slug = data.slug

            await Category.findByIdAndUpdate({data}, {$set: updates});
        }
        
    }
};
