const Funcionario = require('../models/Funcionario');
const bcrypt = require('bcryptjs');

// Criar um novo funcionário
const criarFuncionario = async (req, res) => {
    const { nome, email, senha, especialidade, tipo, comissao } = req.body;

    try {
        // Verifica se o funcionário já existe
        const funcionarioExistente = await Funcionario.findOne({ where: { email } });
        if (funcionarioExistente) {
            return res.status(400).json({ message: 'Funcionário já existe' });
        }

        // Hash da senha
        const hashedSenha = await bcrypt.hash(senha, 10);

        // Cria o funcionário
        const novoFuncionario = await Funcionario.create({
            nome,
            email,
            senha: hashedSenha,
            especialidade,
            tipo,
            comissao,
        });

        res.status(201).json({ message: 'Funcionário criado com sucesso', funcionario: novoFuncionario });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar funcionário', error });
    }
};

// Listar todos os funcionários
const listarFuncionarios = async (req, res) => {
    try {
        const funcionarios = await Funcionario.findAll();
        res.status(200).json(funcionarios);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao listar funcionários', error });
    }
};

// Obter um funcionário por ID
const listarFuncionarioID = async (req, res) => {
    const { id } = req.params;

    try {
        const funcionario = await Funcionario.findByPk(id);
        if (!funcionario) {
            return res.status(404).json({ message: 'Funcionário não encontrado' });
        }
        res.status(200).json(funcionario);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao obter funcionário', error });
    }
};

// Atualizar um funcionário
const atualizarFuncionario = async (req, res) => {
    const { id } = req.params;
    const { nome, email, especialidade, tipo, comissao } = req.body;

    try {
        const funcionario = await Funcionario.findByPk(id);
        if (!funcionario) {
            return res.status(404).json({ message: 'Funcionário não encontrado' });
        }

        // Atualiza os campos
        funcionario.nome = nome || funcionario.nome;
        funcionario.email = email || funcionario.email;
        funcionario.especialidade = especialidade || funcionario.especialidade;
        funcionario.tipo = tipo || funcionario.tipo;
        funcionario.comissao = comissao || funcionario.comissao;

        await funcionario.save();
        res.status(200).json({ message: 'Funcionário atualizado com sucesso', funcionario });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar funcionário', error });
    }
};

// Excluir um funcionário
const excluirFuncionario = async (req, res) => {
    const { id } = req.params;

    try {
        const funcionario = await Funcionario.findByPk(id);
        if (!funcionario) {
            return res.status(404).json({ message: 'Funcionário não encontrado' });
        }

        await funcionario.destroy();
        res.status(200).json({ message: 'Funcionário excluído com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao excluir funcionário', error });
    }
};

module.exports = {
    criarFuncionario,
    listarFuncionarios,
    listarFuncionarioID,
    atualizarFuncionario,
    excluirFuncionario,
};