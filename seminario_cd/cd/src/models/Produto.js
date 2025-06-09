const mongoose = require('mongoose');

const ProdutoSchema = new mongoose.Schema({
  sku: {
    type: String,
    required: true,
    unique: true
  },
  nome: {
    type: String,
    required: true
  },
  descricao: {
    type: String,
    required: true
  },
  valor: {
    type: Number,
    required: true
  },
  quantidade: {
    type: Number,
    required: true,
    min: 0
  }
});

module.exports = mongoose.model('Produto', ProdutoSchema); 