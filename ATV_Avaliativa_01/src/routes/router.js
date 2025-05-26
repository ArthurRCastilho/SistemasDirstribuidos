const express = require('express');
const router = express.Router();
const passageiroController = require('../controllers/passageiroController');
const vooController = require('../controllers/vooController');
const portaoController = require('../controllers/portaoController');

// Rota raiz
router.get('/', (req, res) => {
    res.json({
        message: 'Bem-vindo à API do Sistema de Aeroporto',
        endpoints: {
            portoes: {
                listar: 'GET /api/portoes',
                criar: 'POST /api/portoes',
                buscar: 'GET /api/portoes/:id',
                atualizar: 'PUT /api/portoes/:id',
                deletar: 'DELETE /api/portoes/:id'
            },
            passageiros: {
                listar: 'GET /api/passageiros',
                criar: 'POST /api/passageiros',
                buscar: 'GET /api/passageiros/:id',
                atualizar: 'PUT /api/passageiros/:id',
                deletar: 'DELETE /api/passageiros/:id',
                checkin: 'PATCH /api/passageiros/:id/checkin'
            },
            voos: {
                listar: 'GET /api/voos',
                criar: 'POST /api/voos',
                buscar: 'GET /api/voos/:id',
                atualizar: 'PUT /api/voos/:id',
                deletar: 'DELETE /api/voos/:id',
                atualizarStatus: 'PATCH /api/voos/:id/status'
            },
            relatorio: {
                diario: 'GET /api/relatorio/diario'
            }
        }
    });
});

// Rotas para Portões
router.post('/portoes', portaoController.criarPortao);e
router.get('/portoes', portaoController.listarPortoes);
router.get('/portoes/:id', portaoController.buscarPortaoPorId);
router.put('/portoes/:id', portaoController.atualizarPortao);
router.delete('/portoes/:id', portaoController.deletarPortao);

// Rotas para Passageiros
router.post('/passageiros', passageiroController.criarPassageiro);
router.get('/passageiros', passageiroController.listarPassageiros);
router.get('/passageiros/:id', passageiroController.buscarPassageiroPorId);
router.put('/passageiros/:id', passageiroController.atualizarPassageiro);
router.delete('/passageiros/:id', passageiroController.deletarPassageiro);
router.patch('/passageiros/:id/checkin', passageiroController.atualizarStatusCheckin);

// Rotas para Voos
router.post('/voos', vooController.criarVoo);
router.get('/voos', vooController.listarVoos);
router.get('/voos/:id', vooController.buscarVooPorId);
router.put('/voos/:id', vooController.atualizarVoo);
router.delete('/voos/:id', vooController.deletarVoo);
router.patch('/voos/:id/status', vooController.atualizarStatusVoo);

// Rota para relatório diário
router.get('/relatorio/diario', vooController.gerarRelatorioDiario);

module.exports = router; 