const User = require('../models/User');
const Endereco = require('../models/Endereco');
const Cargo = require('../models/Cargo');
const Departamento = require('../models/Departamento');
const { validationResult } = require('express-validator');

class UserController {
    // GET /users
    async index(req, res) {
        try {
            const users = await User.find()
                .populate('endereco')
                .populate('cargo')
                .populate('departamento');
            return res.json(users);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar usuários' });
        }
    }

    // GET /users/:id
    async show(req, res) {
        try {
            const user = await User.findById(req.params.id)
                .populate('endereco')
                .populate('cargo')
                .populate('departamento');
            
            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }
            
            return res.json(user);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar usuário' });
        }
    }

    // POST /users
    async store(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { endereco, cargo, departamento, ...userData } = req.body;

            // Verificar se os relacionamentos existem
            const [enderecoExists, cargoExists, departamentoExists] = await Promise.all([
                Endereco.findById(endereco),
                Cargo.findById(cargo),
                Departamento.findById(departamento)
            ]);

            if (!enderecoExists || !cargoExists || !departamentoExists) {
                return res.status(400).json({ error: 'Endereço, cargo ou departamento inválido' });
            }

            const user = await User.create({
                ...userData,
                endereco,
                cargo,
                departamento
            });

            return res.status(201).json(user);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao criar usuário' });
        }
    }

    // PUT /users/:id
    async update(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { endereco, cargo, departamento, ...userData } = req.body;

            // Verificar se os relacionamentos existem
            if (endereco || cargo || departamento) {
                const [enderecoExists, cargoExists, departamentoExists] = await Promise.all([
                    endereco ? Endereco.findById(endereco) : true,
                    cargo ? Cargo.findById(cargo) : true,
                    departamento ? Departamento.findById(departamento) : true
                ]);

                if (!enderecoExists || !cargoExists || !departamentoExists) {
                    return res.status(400).json({ error: 'Endereço, cargo ou departamento inválido' });
                }
            }

            const user = await User.findByIdAndUpdate(
                req.params.id,
                { ...userData, endereco, cargo, departamento },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            return res.json(user);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao atualizar usuário' });
        }
    }

    // DELETE /users/:id
    async destroy(req, res) {
        try {
            const user = await User.findByIdAndDelete(req.params.id);

            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao deletar usuário' });
        }
    }
}

module.exports = new UserController(); 