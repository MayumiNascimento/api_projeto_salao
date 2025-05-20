const express = require("express");
const router = express.Router();
const { verificarToken, permitirApenasAdmin } = require("../middlewares/authMiddleware");
const AdminController = require("../controllers/adminController");

router.get("/dashboard", verificarToken, permitirApenasAdmin, AdminController.obterDashboard);
router.get("/dashboard/desempenho-mensal", verificarToken, permitirApenasAdmin, AdminController.obterDesempenhoMensal);

module.exports = router;
