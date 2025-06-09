require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const readline = require('readline');
const Produto = require('./models/Produto');

const app = express();
const PORT = process.env.PORT || 3001;
const HUB_URL = process.env.HUB_URL || 'http://localhost:3000';

app.use(cors());
app.use(express.json());

// Conectar ao MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cd')
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Interface de terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Função para credenciar CD no HUB
async function credenciarCD() {
  try {
    const response = await axios.post(`${HUB_URL}/api/cd/credenciar`, {
      ip: process.env.CD_IP || 'localhost',
      porta: PORT
    });
    console.log('CD credenciado com sucesso:', response.data);
  } catch (error) {
    console.error('Erro ao credenciar CD:', error.message);
  }
}

// Função para buscar produtos em outros CDs
async function buscarProdutos(sku, quantidade) {
  try {
    const response = await axios.get(`${HUB_URL}/api/cd/ativos/${process.env.CD_IP}/${sku}/${quantidade}`);
    return response.data.cds;
  } catch (error) {
    console.error('Erro ao buscar produtos:', error.message);
    return [];
  }
}

// Função para realizar transação com outro CD
async function realizarTransacao(cdDestino, sku, quantidade) {
  try {
    // Primeiro, verifica se o produto ainda está disponível
    const response = await axios.get(`http://${cdDestino.ip}:${cdDestino.porta}/api/produtos/verificar/${sku}/${quantidade}`);
    
    if (!response.data.disponivel) {
      console.log('Produto não está mais disponível na quantidade solicitada');
      return false;
    }

    // Realiza a transação
    const transacaoResponse = await axios.post(`http://${cdDestino.ip}:${cdDestino.porta}/api/produtos/transacao`, {
      sku,
      quantidade,
      cdDestino: {
        ip: process.env.CD_IP,
        porta: PORT
      }
    });

    if (transacaoResponse.data.success) {
      // Atualiza o estoque local
      const produto = await Produto.findOne({ sku });
      if (produto) {
        produto.quantidade += parseInt(quantidade);
        await produto.save();
      } else {
        // Se o produto não existe, cria um novo
        const novoProduto = new Produto({
          sku,
          nome: transacaoResponse.data.produto.nome,
          descricao: transacaoResponse.data.produto.descricao,
          valor: transacaoResponse.data.produto.valor,
          quantidade: parseInt(quantidade)
        });
        await novoProduto.save();
      }
      console.log('Transação realizada com sucesso!');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Erro ao realizar transação:', error.message);
    return false;
  }
}

// Rotas da API
app.get('/api/produtos', async (req, res) => {
  try {
    const produtos = await Produto.find();
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar produtos', error: error.message });
  }
});

app.post('/api/produtos', async (req, res) => {
  try {
    const produto = new Produto(req.body);
    await produto.save();
    res.status(201).json(produto);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar produto', error: error.message });
  }
});

// Rota para verificar disponibilidade do produto
app.get('/api/produtos/verificar/:sku/:quantidade', async (req, res) => {
  try {
    const { sku, quantidade } = req.params;
    const produto = await Produto.findOne({ sku });
    
    if (!produto) {
      return res.json({ disponivel: false });
    }

    const quantidadeDisponivel = produto.quantidade >= parseInt(quantidade);
    res.json({
      disponivel: quantidadeDisponivel,
      quantidade: produto.quantidade,
      valor: produto.valor
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao verificar produto', error: error.message });
  }
});

// Rota para realizar transação
app.post('/api/produtos/transacao', async (req, res) => {
  try {
    const { sku, quantidade, cdDestino } = req.body;
    const produto = await Produto.findOne({ sku });
    
    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    
    if (produto.quantidade < quantidade) {
      return res.status(400).json({ message: 'Quantidade insuficiente em estoque' });
    }
    
    produto.quantidade -= parseInt(quantidade);
    await produto.save();
    
    res.json({
      success: true,
      message: 'Transação realizada com sucesso',
      produto: {
        sku: produto.sku,
        nome: produto.nome,
        descricao: produto.descricao,
        valor: produto.valor
      }
    });
  } catch (error) {
    res.status(400).json({ message: 'Erro ao realizar transação', error: error.message });
  }
});

// Menu interativo
function mostrarMenu() {
  console.log('\n=== Menu do CD ===');
  console.log('1. Cadastrar novo produto');
  console.log('2. Listar produtos');
  console.log('3. Buscar produtos em outros CDs');
  console.log('4. Sair');
  
  rl.question('Escolha uma opção: ', async (opcao) => {
    switch (opcao) {
      case '1':
        rl.question('SKU do produto: ', async (sku) => {
          rl.question('Nome do produto: ', async (nome) => {
            rl.question('Descrição do produto: ', async (descricao) => {
              rl.question('Valor do produto: ', async (valor) => {
                rl.question('Quantidade em estoque: ', async (quantidade) => {
                  try {
                    const produto = new Produto({
                      sku,
                      nome,
                      descricao,
                      valor: parseFloat(valor),
                      quantidade: parseInt(quantidade)
                    });
                    await produto.save();
                    console.log('Produto cadastrado com sucesso!');
                  } catch (error) {
                    console.error('Erro ao cadastrar produto:', error.message);
                  }
                  mostrarMenu();
                });
              });
            });
          });
        });
        break;
        
      case '2':
        try {
          const produtos = await Produto.find();
          console.log('\nProdutos cadastrados:');
          produtos.forEach(p => console.log(`${p.nome} - SKU: ${p.sku} - Qtd: ${p.quantidade} - Valor: R$ ${p.valor}`));
        } catch (error) {
          console.error('Erro ao listar produtos:', error.message);
        }
        mostrarMenu();
        break;
        
      case '3':
        rl.question('SKU do produto: ', async (sku) => {
          rl.question('Quantidade necessária: ', async (quantidade) => {
            const cds = await buscarProdutos(sku, parseInt(quantidade));
            if (cds.length > 0) {
              console.log('\nCDs disponíveis:');
              cds.forEach((cd, index) => {
                console.log(`${index + 1}. IP: ${cd.ip}, Porta: ${cd.porta}`);
                console.log(`   Quantidade disponível: ${cd.quantidade}`);
                console.log(`   Valor unitário: R$ ${cd.valor}`);
                console.log(`   Valor total: R$ ${cd.valor * parseInt(quantidade)}`);
              });
              
              rl.question('Escolha o número do CD para transação: ', async (escolha) => {
                const cdEscolhido = cds[parseInt(escolha) - 1];
                if (cdEscolhido) {
                  await realizarTransacao(cdEscolhido, sku, parseInt(quantidade));
                }
                mostrarMenu();
              });
            } else {
              console.log('Nenhum CD disponível com o produto solicitado.');
              mostrarMenu();
            }
          });
        });
        break;
        
      case '4':
        rl.close();
        process.exit(0);
        break;
        
      default:
        console.log('Opção inválida!');
        mostrarMenu();
    }
  });
}

// Iniciar servidor
app.listen(PORT, async () => {
  console.log(`Servidor CD rodando na porta ${PORT}`);
  await credenciarCD();
  mostrarMenu();
}); 