const { Router } = require('express');
const { body } = require('express-validator');
const UserController = require('./controllers/UserController');

const routes = Router();

// Validações
const userValidations = [
    body('nome').notEmpty().withMessage('O nome é obrigatório'),
    body('email').isEmail().withMessage('Email inválido'),
    body('senha').isLength({ min: 6 }).withMessage('A senha deve ter no mínimo 6 caracteres'),
    body('endereco').isMongoId().withMessage('Endereço inválido'),
    body('telefone').matches(/^\(\d{2}\) \d{5}-\d{4}$/).withMessage('Formato de telefone inválido'),
    body('cargo').isMongoId().withMessage('Cargo inválido'),
    body('departamento').isMongoId().withMessage('Departamento inválido'),
    body('dataNascimento').isISO8601().withMessage('Data de nascimento inválida')
];

// Rotas de usuário
routes.get('/users', UserController.index);
routes.get('/users/:id', UserController.show);
routes.post('/users', userValidations, UserController.store);
routes.put('/users/:id', userValidations, UserController.update);
routes.delete('/users/:id', UserController.destroy);

module.exports = routes; 