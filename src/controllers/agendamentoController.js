const Agendamento = require('../models/Agendamento');
const Servico = require('../models/Servico');
const Funcionario = require('../models/Funcionario');

const criarAgendamento = async (req, res) => {
    const { cliente_nome, cliente_telefone, funcionario_id, dia, hora, status, observacoes, desconto, servicos } = req.body;

    try {
        // Verifica se já existe um agendamento para o mesmo funcionário, dia e hora
        const agendamentoExistente = await Agendamento.findOne({
            where: { funcionario_id, dia, hora }
        });
        if (agendamentoExistente) {
            return res.status(400).json({ message: 'Já existe um agendamento para este funcionário neste horário.' });
        }

        const novoAgendamento = await Agendamento.create({
            cliente_nome,
            cliente_telefone,
            funcionario_id,
            dia,
            hora,
            status,
            observacoes,
            desconto,
        });
        // Associa os serviços ao agendamento
        if (servicos && servicos.length > 0) {
            await novoAgendamento.setServicos(servicos);
        }
        res.status(201).json({ message: 'Agendamento criado com sucesso', agendamento: novoAgendamento });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar agendamento', error });
    }
};

const listarAgendamentos = async (req, res) => {
    try {
        const agendamentos = await Agendamento.findAll({
            include: [
                { model: Funcionario, as: 'Funcionario' }, 
                { model: Servico, as: 'Servicos',
                  through: { attributes: [] }, // remove a tabela intermediaria
                 },
            ]
    });
    // Mapeando os agendamentos para calcular o total
        const agendamentosComTotal = agendamentos.map(agendamento => {
        const totalServicos = agendamento.Servicos.reduce((sum, servico) => sum + parseFloat(servico.preco), 0);
        const desconto = parseFloat(agendamento.desconto) || 0;
        const total = totalServicos - desconto;

        return {
            ...agendamento.toJSON(),
            total: total.toFixed(2) 
        };
    });
    return res.status(200).json(agendamentosComTotal);

    } catch (error) {
        res.status(500).json({ message: 'Erro ao listar agendamentos', error : { name: error.name, message: error.message } });
    }
};

// Obter um agendamento por ID
const listarAgendamentoID = async (req, res) => {
    const { id } = req.params;

    try {
        const agendamento = await Agendamento.findByPk(id, {
            include: [
                { model: Funcionario, as: 'Funcionario' }, 
                { model: Servico, as: 'Servicos',
                  through: { attributes: [] }, // remove a tabela intermediaria
                 }, 
            ]
        });

        if (!agendamento) {
            return res.status(404).json({ message: 'Agendamento não encontrado' });
        }

        // total do agendamento
        const totalServicos = agendamento.Servicos.reduce((sum, servico) => sum + parseFloat(servico.preco), 0);
        const desconto = parseFloat(agendamento.desconto) || 0;
        const total = totalServicos - desconto;

        return res.status(200).json({
            ...agendamento.toJSON(),
            total: total.toFixed(2) 
        });
        
    } catch (error) {
        console.error("Erro ao obter agendamento:", error);
        res.status(500).json({ message: 'Erro ao obter agendamento', error });
    }
};

// Atualizar um agendamento
const atualizarAgendamento = async (req, res) => {
    const { id } = req.params;
    const { cliente_nome, cliente_telefone, funcionario_id, dia, hora, status, observacoes, desconto, servicos } = req.body;

    try {
        const agendamento = await Agendamento.findByPk(id);
        if (!agendamento) {
            return res.status(404).json({ message: 'Agendamento não encontrado' });
        }

        // Atualiza os campos
        agendamento.cliente_nome = cliente_nome || agendamento.cliente_nome;
        agendamento.cliente_telefone = cliente_telefone || agendamento.cliente_telefone;
        agendamento.funcionario_id = funcionario_id || agendamento.funcionario_id;
        agendamento.dia = dia || agendamento.dia;
        agendamento.hora = hora || agendamento.hora;
        agendamento.status = status || agendamento.status;
        agendamento.observacoes = observacoes || agendamento.observacoes;
        agendamento.desconto = desconto || agendamento.desconto;

        // Atualiza os serviços associados ao agendamento
        if (servicos) {
            await agendamento.setServicos(servicos);
        }

        await agendamento.save();
        res.status(200).json({ message: 'Agendamento atualizado com sucesso', agendamento });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar agendamento', error });
    }
};

// Excluir um agendamento
const excluirAgendamento = async (req, res) => {
    const { id } = req.params;

    try {
        const agendamento = await Agendamento.findByPk(id);
        if (!agendamento) {
            return res.status(404).json({ message: 'Agendamento não encontrado' });
        }

        await agendamento.destroy();
        res.status(200).json({ message: 'Agendamento excluído com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao excluir agendamento', error });
    }
};

module.exports = {
    criarAgendamento,
    listarAgendamentos,
    listarAgendamentoID,
    atualizarAgendamento,
    excluirAgendamento,
};