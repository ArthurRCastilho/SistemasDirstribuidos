const {checkSchema} = require ('express-validator');

module.exports = {
    editAction: checkSchema({
        name: {
            notEmpty: true,
            trim: true, //consumir os espaços em branco, por exemplo os espaços escritos apos o usuario digitar o nome
            isLength:{
                options: {min:2}
            },
            errorMessage: 'Nome precisa de pelo menos 2 caracteres'
        },
        email: {
            isEmail:true,
            normalizeEmail: true,
            errorMessage: 'Email invalido'
        },
        passwordHash:{
            isLength:{
                options: {min: 8}
            },
            errorMessage: 'Senha precisa de pelo menos 8 caracteres'
        },
        state: {
            notEmpty: true,
            errorMessage: 'Estado obrigatorio'
            
        }
    })
}