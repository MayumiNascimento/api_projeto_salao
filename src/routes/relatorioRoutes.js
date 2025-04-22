const express = require("express");
const router = express.Router();
const { verificarToken, permitirApenasAdmin } = require('../middlewares/authMiddleware');
const { gerarRelatorio } = require("../controllers/relatorioController");

// Definir a rota para gerar o relatório
router.get("/relatorio", verificarToken,permitirApenasAdmin, gerarRelatorio);

module.exports = router;
