const mongoose = require ('mongoose');
const Category = require('./models/category');

module.exports = {
    getCategory: async(req, res ) => {
        let categories = await category.find();
        res.json({categories}); }
}