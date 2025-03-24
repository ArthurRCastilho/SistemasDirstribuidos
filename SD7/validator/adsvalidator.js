const { ExpressValidator, checkSchema } = require("express-validator");
const { editAction } = require("./uservalidator");

module.exports = {
    editAction: checkSchema({
        idUser:{
            notEmpty: true,
            isString: true,
            errorMessage: 'Precisa conter um numero de id de user'
        },

        dataCreated: {
            isISO8601: true,
            optional: true,
            errorMessage: 'Data de criação inválida'
        },

        tittle: {
            notEmpty: true,
            trim: true,
            isLength: {
                options: {min:1}
            },
            errorMessage: 'Titulo precisa de pelo menos 1 caractere '
        },

        price: {
            isFloat: {
                options: {min: 0}
            },
            errorMessage: 'O preço nao pode ser negativo'
        }



        
    })
}