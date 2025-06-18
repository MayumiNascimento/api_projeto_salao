const { Op } = require("sequelize");
const { Agendamento, Servico, Funcionario } = require("../models");

const gerarRelatorio = async (req, res) => {
    try {
        const { dataInicio, dataFim, incluirCancelados } = req.query;

        // Validando entrada
        if (!dataInicio || !dataFim) {
            return res.status(400).json({ message: "As datas de início e fim são obrigatórias." });
        }

        // Buscar agendamentos concluídos dentro do período
        const agendamentosConcluidos = await Agendamento.findAll({
            where: {
                dia: { [Op.between]: [dataInicio, dataFim] },
                status: "concluído"
            },
            include: [
                { model: Servico, as: "Servicos", through: { attributes: [] } },
                { model: Funcionario, as: "Funcionario" }
            ]
        });

        // Buscar agendamentos cancelados (se solicitado)
        let agendamentosCancelados = [];
        if (incluirCancelados === "true") {
            agendamentosCancelados = await Agendamento.findAll({
                where: {
                    dia: { [Op.between]: [dataInicio, dataFim] },
                    status: "cancelado"
                },
                include: [
                    { model: Servico, as: "Servicos", through: { attributes: [] } },
                    { model: Funcionario, as: "Funcionario" }
                ]
            });
        }

        // Inicializando totais
        let totalBruto = 0;
        let totalLiquido = 0;
        let comissoesPorFuncionario = {};

        const processarAgendamento = (agendamento) => {
            const Servicos = agendamento.Servicos || [];
            const totalServicos = servicos.reduce((sum, servico) => sum + parseFloat(servico.preco), 0);
            const desconto = parseFloat(agendamento.desconto) || 0;
            const totalAgendamento = totalServicos - desconto;

            return {
                Servicos: Servicos.map(s => ({
                    nome: s.nome,
                    preco: s.preco,
                })),
                totalServicos,
                totalAgendamento
            };
        };

        // Processando os agendamentos concluídos para os cálculos
        const listaAgendamentosConcluidos = agendamentosConcluidos.map(agendamento => {

            const { Servicos, totalServicos, totalAgendamento } = processarAgendamento(agendamento);

            totalBruto += totalServicos;
            totalLiquido += totalAgendamento;

            // Calculando comissão por funcionário
            if (agendamento.Funcionario) {
                const funcionarioId = agendamento.Funcionario.id;
                const comissaoPercentual = parseFloat(agendamento.Funcionario.comissao) / 100;
                const comissaoValor = totalServicos * comissaoPercentual;

                if (!comissoesPorFuncionario[funcionarioId]) {
                    comissoesPorFuncionario[funcionarioId] = {
                        nome: agendamento.Funcionario.nome,
                        totalComissao: 0
                    };
                }
                comissoesPorFuncionario[funcionarioId].totalComissao += comissaoValor;
            }

            return {
                id: agendamento.id,
                cliente_nome: agendamento.cliente_nome,
                funcionario_id: agendamento.Funcionario?.nome || "Não atribuído",
                dia: agendamento.dia,
                hora: agendamento.hora,
                desconto: agendamento.desconto,
                Servicos,
                total: totalAgendamento.toFixed(2)
            };
        });

        // Processando a listagem de cancelados (se houver)
        const listaAgendamentosCancelados = agendamentosCancelados.map(agendamento => {
            const { Servicos } = processarAgendamento(agendamento);
            
            return {
                id: agendamento.id,
                cliente_nome: agendamento.cliente_nome,
                funcionario_id: agendamento.Funcionario?.nome || "Não atribuído",
                dia: agendamento.dia,
                hora: agendamento.hora,
                Servicos
            };
        });

        // Retorno da API com os dados processados
        return res.status(200).json({
            periodo: { dataInicio, dataFim },
            totalBruto: totalBruto.toFixed(2),
            totalLiquido: totalLiquido.toFixed(2),
            comissoes: Object.values(comissoesPorFuncionario),
            agendamentosConcluidos: listaAgendamentosConcluidos,
            agendamentosCancelados: incluirCancelados === "true" ? listaAgendamentosCancelados : []
        });

    } catch (error) {
        console.error("Erro ao gerar relatório:", error);
        return res.status(500).json({ message: "Erro ao gerar relatório.", error });
    }
};

module.exports = { gerarRelatorio };
