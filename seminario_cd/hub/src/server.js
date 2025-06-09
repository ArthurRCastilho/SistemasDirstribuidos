require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const CD = require('./models/CD');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Conectar ao MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hub-cd')
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Rota para credenciamento de CD
app.post('/api/cd/credenciar', async (req, res) => {
  try {
    const { ip, porta } = req.body;
    
    // Verifica se já existe um CD com este IP
    const cdExistente = await CD.findOne({ ip });
    if (cdExistente) {
      console.log(`[HUB] Tentativa de credenciamento duplicado do CD: ${ip}:${porta}`);
      return res.status(400).json({ message: 'CD já cadastrado com este IP' });
    }

    const cd = new CD({ ip, porta });
    await cd.save();
    console.log(`[HUB] Novo CD credenciado: ${ip}:${porta}`);
    res.status(201).json({ message: 'CD credenciado com sucesso', cd });
  } catch (error) {
    console.error(`[HUB] Erro ao credenciar CD ${ip}:${porta}:`, error.message);
    res.status(400).json({ message: 'Erro ao credenciar CD', error: error.message });
  }
});

// Rota para verificar CDs ativos com produto específico
app.get('/api/cd/ativos/:ip/:sku/:quantidade', async (req, res) => {
  try {
    const { ip, sku, quantidade } = req.params;
    const quantidadeNecessaria = parseInt(quantidade);

    console.log(`\n[HUB] Solicitação de produtos recebida:`);
    console.log(`[HUB] CD Solicitante: ${ip}`);
    console.log(`[HUB] Produto SKU: ${sku}`);
    console.log(`[HUB] Quantidade solicitada: ${quantidadeNecessaria}`);

    // Busca todos os CDs ativos exceto o CD solicitante
    const cdsAtivos = await CD.find({ 
      ativo: true,
      ip: { $ne: ip } // Exclui o CD solicitante da busca
    });

    console.log(`[HUB] Total de CDs ativos (exceto solicitante): ${cdsAtivos.length}`);

    // Array para armazenar os CDs que possuem o produto
    const cdsComProduto = [];

    // Para cada CD ativo, verifica se possui o produto
    for (const cd of cdsAtivos) {
      try {
        console.log(`[HUB] Verificando produto no CD: ${cd.ip}:${cd.porta}`);
        const response = await fetch(`http://${cd.ip}:${cd.porta}/api/produtos/verificar/${sku}/${quantidadeNecessaria}`);
        const data = await response.json();

        if (data.disponivel) {
          console.log(`[HUB] CD ${cd.ip} possui o produto disponível:`);
          console.log(`[HUB] - Quantidade: ${data.quantidade}`);
          console.log(`[HUB] - Valor: R$ ${data.valor}`);
          
          cdsComProduto.push({
            ip: cd.ip,
            porta: cd.porta,
            quantidade: data.quantidade,
            valor: data.valor
          });
        } else {
          console.log(`[HUB] CD ${cd.ip} não possui o produto disponível`);
        }
      } catch (error) {
        console.error(`[HUB] Erro ao verificar produto no CD ${cd.ip}:`, error.message);
      }
    }

    // Ordena os CDs por valor (menor preço primeiro)
    cdsComProduto.sort((a, b) => a.valor - b.valor);

    console.log(`[HUB] Total de CDs com produto disponível: ${cdsComProduto.length}`);
    console.log(`[HUB] Enviando resposta para o CD ${ip}\n`);

    res.json({ cds: cdsComProduto });
  } catch (error) {
    console.error(`[HUB] Erro ao processar solicitação do CD ${ip}:`, error.message);
    res.status(500).json({ message: 'Erro ao buscar CDs ativos', error: error.message });
  }
});

// Rota para atualizar status do CD
app.patch('/api/cd/:ip/status', async (req, res) => {
  try {
    const { ip } = req.params;
    const { ativo } = req.body;
    const cd = await CD.findOneAndUpdate({ ip }, { ativo }, { new: true });
    console.log(`[HUB] Status do CD ${ip} atualizado para: ${ativo ? 'Ativo' : 'Inativo'}`);
    res.json(cd);
  } catch (error) {
    console.error(`[HUB] Erro ao atualizar status do CD ${ip}:`, error.message);
    res.status(400).json({ message: 'Erro ao atualizar status do CD', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`[HUB] Servidor HUB rodando na porta ${PORT}`);
}); 