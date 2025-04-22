const db = require("../models"); // Ajuste para importar seu banco de dados, se necessário

const AdminController = {
  obterDashboard: async (req, res) => {
    try {
      // Exemplo de dados para o dashboard
      const totalAgendamentos = await db.Agendamento.count();
      const totalFuncionarios = await db.Funcionario.count();
      const receitaTotal = await db.Agendamento.sum("total"); // Ajuste conforme sua tabela

      res.json({
        sucesso: true,
        dados: {
          totalAgendamentos,
          totalFuncionarios,
          receitaTotal,
        },
      });
    } catch (erro) {
      res.status(500).json({ sucesso: false, mensagem: "Erro ao carregar dashboard", erro });
    }
  },
};

module.exports = AdminController;
