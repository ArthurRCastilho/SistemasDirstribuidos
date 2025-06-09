const mongoose = require('mongoose');

const CDSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true,
    unique: true
  },
  porta: {
    type: Number,
    required: true
  },
  ativo: {
    type: Boolean,
    default: true
  },
  dataCadastro: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CD', CDSchema); 