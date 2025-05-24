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
      const agendamentosConcluidos = await db.Agendamento.findAll({
        where: { status: 'concluído' },
        attributes: ['total', 'desconto']
      });

      const receitaTotal = agendamentosConcluidos.reduce((soma, agendamento) => {
        return soma + (agendamento.total - agendamento.desconto);
      }, 0);

       // Agendamentos do dia
       const agendamentosDoDia = await db.Agendamento.count({
        where: {
          dia: {
            [Op.between]: [hoje, amanha],
          },
        },
      });

      res.json({
        sucesso: true,
        dados: {
          totalAgendamentos,
          totalFuncionarios,
          receitaTotal,
          agendamentosDoDia,
        },
      });
    } catch (erro) {
      res.status(500).json({ sucesso: false, mensagem: "Erro ao carregar dashboard", erro: erro.message || erro.toString() });
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

        const agendamentosMes = await db.Agendamento.findAll({
          where: {
            status: 'concluido',
            dia: {
              [Op.between]: [inicio, fim],
            },
          },
          attributes: ['total', 'desconto']
        });

        const receita = agendamentosMes.reduce((soma, agendamento) => {
          return soma + (agendamento.total - agendamento.desconto);
        }, 0);

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
