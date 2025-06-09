# Sistema de Centros de Distribuição (CD)

Este é um sistema distribuído que gerencia a comunicação entre um HUB e múltiplos Centros de Distribuição (CDs) usando Node.js, MongoDB, Mongoose e Express.

## Requisitos

- Node.js
- MongoDB
- NPM ou Yarn

## Estrutura do Projeto

```
.
├── hub/               # Servidor HUB
│   ├── src/
│   │   ├── models/
│   │   │   └── CD.js
│   │   └── server.js
│   ├── .env
│   └── package.json
│
└── cd/               # Servidor CD
    ├── src/
    │   ├── models/
    │   │   └── Produto.js
    │   └── server.js
    ├── .env
    └── package.json
```

## Configuração

1. Instale as dependências do HUB:
```bash
cd hub
npm install
```

2. Instale as dependências do CD:
```bash
cd cd
npm install
```

3. Configure as variáveis de ambiente:
   - Copie os arquivos `.env.example` para `.env` em ambos os diretórios
   - Ajuste as configurações conforme necessário

## Executando o Sistema

1. Inicie o MongoDB:
```bash
mongod
```

2. Em um terminal, inicie o HUB:
```bash
cd hub
npm start
```

3. Em outro terminal, inicie um CD:
```bash
cd cd
npm start
```

4. Para iniciar mais CDs, abra novos terminais e execute o mesmo comando, alterando a porta no arquivo `.env` de cada CD.

## Funcionalidades

### HUB
- Gerencia os CDs credenciados
- Verifica status dos CDs (ativo/inativo)
- Fornece lista de CDs ativos com produtos disponíveis

### CD
- Gerencia produtos (CRUD)
- Interface via terminal para interação
- Realiza transações com outros CDs
- Busca produtos em outros CDs através do HUB

## Fluxo de Funcionamento

1. CD solicita credenciamento no HUB
2. HUB confirma ou não a inclusão
3. CD pode solicitar lista de CDs ativos com produtos
4. HUB verifica e retorna lista de CDs disponíveis
5. CD seleciona outro CD para transação
6. Transação é realizada diretamente entre os CDs
7. Estoque é atualizado em ambos os CDs 