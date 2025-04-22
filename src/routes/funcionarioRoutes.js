const express = require('express');
const funcionarioController = require('../controllers/funcionarioController');
const { verificarToken, permitirApenasAdmin, permitirApenasFuncionario } = require('../middlewares/authMiddleware');

const router = express.Router();

// Rotas para funcionários
router.post('/funcionarios', verificarToken, permitirApenasAdmin, funcionarioController.criarFuncionario);
router.get('/funcionarios', verificarToken, funcionarioController.listarFuncionarios);
router.get('/funcionarios/:id', verificarToken, funcionarioController.listarFuncionarioID);
router.put('/funcionarios/:id', verificarToken, permitirApenasAdmin, funcionarioController.atualizarFuncionario);
router.delete('/funcionarios/:id', verificarToken, permitirApenasAdmin, funcionarioController.excluirFuncionario);
router.post('/funcionarios/trocar-senha', verificarToken, funcionarioController.trocarSenha);

router.get("/agenda", verificarToken, permitirApenasFuncionario, funcionarioController.verAgenda);
router.get("/comissoes", verificarToken, permitirApenasFuncionario, funcionarioController.verComissoes);

module.exports = router;