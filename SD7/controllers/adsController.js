const mongoose = require('mongoose');
const Ads = require('../models/ads');
const User = require('../models/user');
const Category = require('../models/category');
const State = require('../models/states');
const { validationResult, matchedData } = require('express-validator');

module.exports = {
    getAds: async (req, res) => {
        try {
            const ads = await Ads.find(); // Busca todos os anúncios
            res.json({ ads });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar anúncios' });
        }
    },
    
    editAds: async (req, res) => {
        const erros = validationResult(req);
        if (!erros.isEmpty()) {
            res.json({ error: erros.mapped() });
            return;
        }

        const data = matchedData(req);
        let updates = {};

        // Restrições de campos não editáveis
        if (data.dateCreated) {
            res.json({ error: 'A data não pode ser alterada' });
            return;
        }
        if (data.views) {
            res.json({ error: 'As views não podem ser alteradas' });
            return;
        }

        // Validação de usuário
        if (data.idUser) {
            const user = await User.findById(data.idUser);
            if (!user) {
                res.json({ error: 'Usuário não existe' });
                return;
            }
            updates.idUser = data.idUser;
        }

        // Validação de estado
        if (data.state) {
            if (mongoose.Types.ObjectId.isValid(data.state)) {
                const stateCheck = await State.findById(data.state);
                if (!stateCheck) {
                    res.json({ error: 'Este estado não existe' });
                    return;
                }
                updates.state = data.state;
            } else {
                res.json({ error: 'Código do estado inválido' });
                return;
            }
        }

        // Título
        if (data.title) {
            updates.title = data.title;
        }

        // Preço
        if (data.price) {
            if (data.price < 0) {
                res.json({ error: 'O preço não pode ser negativo' });
                return;
            }
            updates.price = data.price;
        }

        // Descrição
        if (data.description) {
            updates.description = data.description;
        }

        // Validação de imagens (deve ser um array de URLs)
        if (data.images) {
            if (!Array.isArray(data.images) || !data.images.every(url => typeof url === 'string')) {
                res.json({ error: 'As imagens devem ser um array de URLs válidas' });
                return;
            }
            updates.images = data.images.map(url => ({ url }));
        }

        // Validação de categoria
        if (data.category) {
            if (!mongoose.Types.ObjectId.isValid(data.category)) {
                res.json({ error: 'ID da categoria inválido' });
                return;
            }
            const categoryCheck = await Category.findById(data.category);
            if (!categoryCheck) {
                res.json({ error: 'Categoria não encontrada' });
                return;
            }
            updates.category = data.category;
        }

        // Status (só aceita 'active' ou 'inactive')
        if (data.status) {
            if (!['active', 'inactive'].includes(data.status)) {
                res.json({ error: 'Status inválido' });
                return;
            }
            updates.status = data.status;
        }

        // Preço Negociável
        if (data.priceNegotiable !== undefined) {
            if (typeof data.priceNegotiable !== 'boolean') {
                res.json({ error: 'O preço negociável deve ser um valor booleano (true ou false)' });
                return;
            }
            updates.priceNegotiable = data.priceNegotiable;
        }

        // Atualizar o anúncio
        try {
            await Ads.findByIdAndUpdate(req.params.id, { $set: updates });
            res.json({ success: 'Anúncio atualizado com sucesso' });
        } catch (error) {
            res.json({ error: 'Erro ao atualizar anúncio' });
        }
    }
};
