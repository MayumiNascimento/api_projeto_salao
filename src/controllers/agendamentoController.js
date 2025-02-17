const Agendamento = require('../models/Agendamento');

// Criar um novo agendamento
const criarAgendamento = async (req, res) => {
    const { cliente_nome, cliente_telefone, servico_id, funcionario_id, dia, hora, status, observacoes, desconto } = req.body;

    try {
        const novoAgendamento = await Agendamento.create({
            cliente_nome,
            cliente_telefone,
            servico_id,
            funcionario_id,
            dia,
            hora,
            status,
            observacoes,
            desconto,
        });
        res.status(201).json({ message: 'Agendamento criado com sucesso', agendamento: novoAgendamento });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar agendamento', error });
    }
};

// Listar todos os agendamentos
const listarAgendamentos = async (req, res) => {
    try {
        const agendamentos = await Agendamento.findAll();
        res.status(200).json(agendamentos);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao listar agendamentos', error });
    }
};

// Obter um agendamento por ID
const listarAgendamentoID = async (req, res) => {
    const { id } = req.params;

    try {
        const agendamento = await Agendamento.findByPk(id);
        if (!agendamento) {
            return res.status(404).json({ message: 'Agendamento não encontrado' });
        }
        res.status(200).json(agendamento);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao obter agendamento', error });
    }
};

// Atualizar um agendamento
const atualizarAgendamento = async (req, res) => {
    const { id } = req.params;
    const { cliente_nome, cliente_telefone, servico_id, funcionario_id, dia, hora, status, observacoes, desconto } = req.body;

    try {
        const agendamento = await Agendamento.findByPk(id);
        if (!agendamento) {
            return res.status(404).json({ message: 'Agendamento não encontrado' });
        }

        // Atualiza os campos
        agendamento.cliente_nome = cliente_nome || agendamento.cliente_nome;
        agendamento.cliente_telefone = cliente_telefone || agendamento.cliente_telefone;
        agendamento.servico_id = servico_id || agendamento.servico_id;
        agendamento.funcionario_id = funcionario_id || agendamento.funcionario_id;
        agendamento.dia = dia || agendamento.dia;
        agendamento.hora = hora || agendamento.hora;
        agendamento.status = status || agendamento.status;
        agendamento.observacoes = observacoes || agendamento.observacoes;
        agendamento.desconto = desconto || agendamento.desconto;

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