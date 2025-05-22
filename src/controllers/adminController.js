const db = require("../models");
const { Op } = require("sequelize");

const AdminController = {
  obterDashboard: async (req, res) => {
    try {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      const amanha = new Date(hoje);
      amanha.setDate(hoje.getDate() + 1);

      const inicioMes = new Date();
      inicioMes.setDate(1);
      inicioMes.setHours(0, 0, 0, 0);

      // dados para o dashboard
      const totalAgendamentos = await db.Agendamento.count();
      const totalFuncionarios = await db.Funcionario.count();
      const receitaTotal = await db.Agendamento.sum("total", {
        where: {
          status: 'concluído',
        }
      });

       // Agendamentos do dia
       const agendamentosDoDia = await db.Agendamento.count({
        where: {
          dia: {
            [Op.between]: [hoje, amanha],
          },
        },
      });

      // Receita do mês 
      const receitaDoMes = await db.Agendamento.sum("total", {
        where: {
          status: 'concluído',
        },
          dia: {
            [Op.between]: [inicioMes, new Date()],
          },
      });

      res.json({
        sucesso: true,
        dados: {
          totalAgendamentos,
          totalFuncionarios,
          receitaTotal,
          agendamentosDoDia,
          receitaDoMes,
        },
      });
    } catch (erro) {
      res.status(500).json({ sucesso: false, mensagem: "Erro ao carregar dashboard", erro });
    }
  },

  obterDesempenhoMensal: async (req, res) => {
    try {
      const anoAtual = new Date().getFullYear();
      const desempenho = [];

      for (let mes = 0; mes < 12; mes++) {
        const inicio = new Date(anoAtual, mes, 1);
        const fim = new Date(anoAtual, mes + 1, 0, 23, 59, 59);

        const agendamentos = await db.Agendamento.count({
          where: {
            dia: {
              [Op.between]: [inicio, fim],
            },
          },
        });

        const receita = await db.Agendamento.sum("total", {
          where: {
            dia: {
              [Op.between]: [inicio, fim],
            },
          },
        });

        desempenho.push({
          mes: inicio.toLocaleString("pt-BR", { month: "short" }),
          agendamentos,
          receita: receita || 0,
        });
      }

      res.json(desempenho);
    } catch (erro) {
      res.status(500).json({ mensagem: "Erro ao carregar desempenho mensal", erro });
    }
  }

};

module.exports = AdminController;
