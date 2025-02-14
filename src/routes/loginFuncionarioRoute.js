const express = require("express");
const router = express.Router();
const { verificarToken, permitirApenasFuncionario } = require("../middlewares/authMiddleware");
const FuncionarioController = require("../controllers/FuncionarioController");

router.get("/agenda", verificarToken, permitirApenasFuncionario, FuncionarioController.verAgenda);

module.exports = router;
