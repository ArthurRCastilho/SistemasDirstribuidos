const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Category = require('./category'); // Importando o modelo Category

const modelSchema = new mongoose.Schema({
    images: [{ url: String }], // Array de objetos com URL da imagem
    idUser: { type: String, required: true },
    dateCreated: { type: Date, default: Date.now },
    state: { type: String, required: true },
    title: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, // Referência ao modelo Category
    price: { type: Number, required: true },
    description: { type: String, required: true },
    priceNegotiable: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
});

const modelName = 'Ads';

if (mongoose.connection && mongoose.connection.models[modelName]) {
    module.exports = mongoose.connection.models[modelName];
} else {
    module.exports = mongoose.model(modelName, modelSchema);
}