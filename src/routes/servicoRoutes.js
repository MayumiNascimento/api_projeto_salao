const express = require('express');
const servicoController = require('../controllers/servicoController');
const { verificarToken, permitirApenasAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// Rotas para serviços
router.post('/servicos', verificarToken, permitirApenasAdmin, servicoController.criarServico);
router.get('/servicos', verificarToken, servicoController.listarServicos);
router.get('/servicos/:id', verificarToken, servicoController.listarServicoID);
router.put('/servicos/:id', verificarToken, permitirApenasAdmin, servicoController.atualizarServico);
router.delete('/servicos/:id', verificarToken, permitirApenasAdmin, servicoController.excluirServico);

module.exports = router;