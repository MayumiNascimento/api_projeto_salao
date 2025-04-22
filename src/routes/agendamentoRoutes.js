const express = require('express');
const agendamentoController = require('../controllers/agendamentoController');
const { verificarToken, permitirApenasAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// Rotas para agendamentos
router.post('/agendamentos', verificarToken,permitirApenasAdmin, agendamentoController.criarAgendamento);
router.get('/agendamentos', verificarToken, agendamentoController.listarAgendamentos);
router.get('/agendamentos/:id', verificarToken, agendamentoController.listarAgendamentoID);
router.put('/agendamentos/:id', verificarToken,permitirApenasAdmin, agendamentoController.atualizarAgendamento);
router.delete('/agendamentos/:id', verificarToken,permitirApenasAdmin, agendamentoController.excluirAgendamento);

module.exports = router;