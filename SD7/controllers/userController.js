const mongoose = require ('mongoose');
const User = require('../models/user');
const {validationResult, matchedData} = require('express-validator')
const bcrypt = require('bcrypt');

module.exports = {
    getStates: async(req, res) => {
        let states = await State.find();
        res.json({states});
    },

    getALLUsers: async(req, res) => {
        let user = await User.find();
        res.json({user});
    },

    editUser: async(req, res) => {
        const erros = validationResult(req);
        if(!erros.isEmpty()) { // Identifica erros ao inserir os dados no banco de dados
            req.json({
                error: erros.mapped()
            });
            return;
        }

        const data = matchedData(req);
        let updates = {};

        if(data.name) {
            updates.name = data.name
        }
        if(data.email) {
            const emailCheck = await User.findOne({email: data.email});
            if(emailCheck) {
                res.json({erro: 'Email já existente.'})
                return;
            }
            updates.email = data.email;
        }
        if(data.state){
            if(mongoose.Types.ObjectId.isValid(data.state)){
                const stateCheck = await State.findById(data.state);
                if(!stateCheck){
                    res.json({erro: 'Este estado não existe'});
                    return;
                }
                updates.state = data.state;
            } else {
                res.json({erro: 'Código do estado não existe'});
                return;
            }
        }
        if(data.passwordHash){
            updates.passwordHash = await bcrypt.hash(data.passwordHash, 10);
        }

        await User.findByIdAndUpdate({data}, {$set: updates});

    }
};



