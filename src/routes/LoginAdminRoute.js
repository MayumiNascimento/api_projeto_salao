const express = require("express");
const router = express.Router();
const { verificarToken, permitirApenasAdmin } = require("../middlewares/authMiddleware");
const AdminController = require("../controllers/AdminController");

router.get("/dashboard", verificarToken, permitirApenasAdmin, AdminController.obterDashboard);

module.exports = router;
