const mongoose = require ('mongoose');
const State = require('../models/states');
const User = require('../models/user');

module.exports = {
    getStates: async(req, res) => {
        let states = await State.find();
        res.json({states});
    },

    getALLUsers: async(req, res) => {
        let user = await User.find();
        res.json({user});
    } 
};



