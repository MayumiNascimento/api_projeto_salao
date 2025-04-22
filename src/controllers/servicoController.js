const Servico = require('../models/Servico');

// Criar um novo serviço
const criarServico = async (req, res) => {
    const { nome, categoria, preco } = req.body;

    const nomeExistente = await Servico.findOne({ where: { nome } });
        if (nomeExistente) {
            return res.status(400).json({ message: 'Já existe um serviço com esse nome' });
        }

    try {
        const novoServico = await Servico.create({
            nome,
            categoria,
            preco,
        });
        res.status(201).json({ message: 'Serviço criado com sucesso', servico: novoServico });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar serviço', error });
    }
};

// Listar todos os serviços
const listarServicos = async (req, res) => {
    try {
        const servicos = await Servico.findAll();
        res.status(200).json(servicos);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao listar serviços', error });
    }
};

// Obter um serviço por ID
const listarServicoID = async (req, res) => {
    const { id } = req.params;

    try {
        const servico = await Servico.findByPk(id);
        if (!servico) {
            return res.status(404).json({ message: 'Serviço não encontrado' });
        }
        res.status(200).json(servico);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao obter serviço', error });
    }
};

// Atualizar um serviço
const atualizarServico = async (req, res) => {
    const { id } = req.params;
    const { nome, categoria, preco } = req.body;

    try {
        const servico = await Servico.findByPk(id);
        if (!servico) {
            return res.status(404).json({ message: 'Serviço não encontrado' });
        }

        // Atualiza os campos
        servico.nome = nome || servico.nome;
        servico.categoria = categoria || servico.categoria;
        servico.preco = preco || servico.preco;

        await servico.save();
        res.status(200).json({ message: 'Serviço atualizado com sucesso', servico });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar serviço', error });
    }
};

// Excluir um serviço
const excluirServico = async (req, res) => {
    const { id } = req.params;

    try {
        const servico = await Servico.findByPk(id);
        if (!servico) {
            return res.status(404).json({ message: 'Serviço não encontrado' });
        }

        await servico.destroy();
        res.status(200).json({ message: 'Serviço excluído com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao excluir serviço', error });
    }
};

module.exports = {
    criarServico,
    listarServicos,
    listarServicoID,
    atualizarServico,
    excluirServico,
};