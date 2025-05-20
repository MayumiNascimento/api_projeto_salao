const Funcionario = require('../models/Funcionario');
const Servico = require('../models/Servico');
const db = require('../models');
const bcrypt = require('bcryptjs');

// Criar um novo funcionário
const criarFuncionario = async (req, res) => {
    const { nome, email, senha, especialidade, tipo, comissao } = req.body;

    try {
        // Verifica se o funcionário já existe

        //verificando email
        const funcionarioExistente = await Funcionario.findOne({ where: { email } });
        if (funcionarioExistente) {
            return res.status(400).json({ message: 'Funcionário já existe' });
        }
        //verificando nome
        const nomeExistente = await Funcionario.findOne({ where: { nome } });
        if (nomeExistente) {
            return res.status(400).json({ message: 'Já existe um funcionário com esse nome' });
        }


        // Cria o funcionário
        const novoFuncionario = await Funcionario.create({
            nome,
            email,
            senha,
            especialidade,
            tipo,
            comissao,
        });

        res.status(201).json({ message: 'Funcionário criado com sucesso', funcionario: novoFuncionario });
    } catch (error) {
        console.error('Erro ao criar funcionário:', error); // Log do erro para depuração
        res.status(500).json({ message: 'Erro ao criar funcionário', error: error.message });
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

 const trocarSenha = async(req, res) => {
    const { id, senhaAtual, novaSenha } = req.body;

  try {
    // Busca o funcionário pelo ID
    const funcionario = await Funcionario.findByPk(id);

    if (!funcionario) {
      return res.status(404).json({ message: 'Funcionário não encontrado.' });
    }

    // Verifica se a senha atual está correta
    const isMatch = await funcionario.comparePassword(senhaAtual);
    if (!isMatch) {
      return res.status(400).json({ message: 'Senha atual incorreta.' });
    }

    // Atualiza a senha
    funcionario.senha = novaSenha;
    await funcionario.save(); // O hook beforeUpdate fará o hash da nova senha

    res.status(200).json({ message: 'Senha alterada com sucesso.' });
  } catch (error) {
    console.error('Erro ao trocar senha:', error);
    res.status(500).json({ message: 'Erro ao trocar senha.' });
  }
 }

//login funcionario

const verAgenda = async(req, res) => {
    try {
      const funcionario_id = req.user.id; // ID do funcionário autenticado

      const agendamentos = await db.Agendamento.findAll({
        include: [
            { model: Servico, as: 'Servicos', through: { attributes: [] }, },
        ],
        where: { funcionario_id },
        order: [["dia", "ASC"], ["hora", "ASC"]],
      });

      res.json({
        sucesso: true,
        dados: agendamentos,
      });
    } catch (erro) {
      console.error("Erro ao carregar agenda:", erro); 
      res.status(500).json({ sucesso: false, mensagem: "Erro ao carregar agenda", erro });
    }
  }

const verComissoes = async (req, res) => {
    try {
      const funcionario_id = req.user.id;
      let { periodo } = req.query; // Query param para filtrar por período

      const funcionario = await db.Funcionario.findByPk(funcionario_id);
        if (!funcionario) {
            return res.status(404).json({ sucesso: false, mensagem: "Funcionário não encontrado" });
        }

      let whereCondition = { funcionario_id };
      let dataAtual = new Date();

      if (periodo === "dia") {
        whereCondition.data = dataAtual.toISOString().split("T")[0]; // Filtra pelo dia atual
      } else if (periodo === "semana") {
        let dataInicioSemana = new Date();
        dataInicioSemana.setDate(dataAtual.getDate() - 7); // Últimos 7 dias
        whereCondition.data = { [db.Sequelize.Op.between]: [dataInicioSemana, dataAtual] };
      }

      const comissoes = await db.Agendamento.findAll({
        where: whereCondition,
        attributes: ["id", "valor", "data"],
      });

      const totalComissao = comissoes.reduce((acc, agendamento) => acc + agendamento.total * funcionario.comissao, 0);

      res.json({
        sucesso: true,
        totalComissao,
        comissoes,
      });
    } catch (erro) {
      res.status(500).json({ sucesso: false, mensagem: "Erro ao carregar comissões", erro });
    }
  }

module.exports = {
    criarFuncionario,
    listarFuncionarios,
    listarFuncionarioID,
    atualizarFuncionario,
    excluirFuncionario,
    trocarSenha,
    verAgenda,
    verComissoes
};