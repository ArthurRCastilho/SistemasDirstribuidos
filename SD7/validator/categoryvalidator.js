const {checkSchema} = require ('express-validator');

module.exports = {
    editAction: checkSchema({
        name:{
            notEmpty: true,
            trim: true,
            isLength: {
                options: {min: 2}
            },
            errorMessage: 'Nome precisa de pelo menos 2 caracteres'
        },
    })
}