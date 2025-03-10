const { checkSchema } = require('express-validator');

module.exports = {
    createAd: checkSchema({
        idUser: {
            notEmpty: {
                errorMessage: 'O campo idUser é obrigatório.',
            },
            isString: {
                errorMessage: 'O campo idUser deve ser uma string.',
            },
        },
        state: {
            notEmpty: {
                errorMessage: 'O campo state é obrigatório.',
            },
            isString: {
                errorMessage: 'O campo state deve ser uma string.',
            },
        },
        title: {
            notEmpty: {
                errorMessage: 'O campo title é obrigatório.',
            },
            isString: {
                errorMessage: 'O campo title deve ser uma string.',
            },
        },
        category: {
            notEmpty: {
                errorMessage: 'O campo category é obrigatório.',
            },
            isMongoId: {
                errorMessage: 'O campo category deve ser um ObjectId válido.',
            },
        },
        price: {
            notEmpty: {
                errorMessage: 'O campo price é obrigatório.',
            },
            isString: {
                errorMessage: 'O campo price deve ser uma string.',
            },
        },
        description: {
            notEmpty: {
                errorMessage: 'O campo description é obrigatório.',
            },
            isString: {
                errorMessage: 'O campo description deve ser uma string.',
            },
        },
        priceNegotiable: {
            optional: true,
            isBoolean: {
                errorMessage: 'O campo priceNegotiable deve ser um booleano.',
            },
        },
        status: {
            optional: true,
            isIn: {
                options: [['active', 'inactive']],
                errorMessage: 'O campo status deve ser "active" ou "inactive".',
            },
        },
    }),
};
