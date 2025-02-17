const express = require('express');
const funcionarioController = require('../controllers/funcionarioController');
const { verificarToken, permitirApenasAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// Rotas para funcionários
router.post('/funcionarios', verificarToken, permitirApenasAdmin, funcionarioController.criarFuncionario);
router.get('/funcionarios', verificarToken, funcionarioController.listarFuncionarios);
router.get('/funcionarios/:id', verificarToken, funcionarioController.listarFuncionarioID);
router.put('/funcionarios/:id', verificarToken, permitirApenasAdmin, funcionarioController.atualizarFuncionario);
router.delete('/funcionarios/:id', verificarToken, permitirApenasAdmin, funcionarioController.excluirFuncionario);

module.exports = router;