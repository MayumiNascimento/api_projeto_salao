const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Funcionario = require('../models/Funcionario');

//excluir após o cadastro do primeiro registro
const register = async (req, res) => {
    const { nome, email, senha, especialidade, tipo, comissao } = req.body;

    try {
        // Verifica se o funcionário já existe
        const existingFuncionario = await Funcionario.findOne({ where: { email } });
        if (existingFuncionario) {
            return res.status(400).json({ message: 'Funcionário já existe' });
        }

        // Hash da senha
        const hashedSenha = await bcrypt.hash(senha, 10);

        // Cria o funcionário no banco de dados
        await Funcionario.create({
            nome,
            email,
            senha: hashedSenha,
            especialidade,
            tipo,
            comissao,
        });

        res.status(201).json({ message: 'Funcionário registrado com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao registrar funcionário', error });
    }
};

const login = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const funcionario = await Funcionario.findOne({ where: { email } });
    
        if (!funcionario) {
          return res.status(401).json({ message: "Usuário não encontrado" });
        }
    
        const senhaValida = await bcrypt.compare(senha, funcionario.senha);
    
        if (!senhaValida) {
          return res.status(401).json({ message: "Senha inválida" });
        }
    
        // Gerando o token JWT
        const token = jwt.sign(
          { id: funcionario.id, tipo: funcionario.tipo }, // Inclui o tipo de usuário
          process.env.JWT_SECRET,
          { expiresIn: "2h" }
        );
    
        // Retorna o token e o tipo de usuário
        return res.json({
          message: "Login realizado com sucesso!",
          token,
          tipo: funcionario.tipo, // Pode ser "admin" ou "funcionario"
        });
      } catch (error) {
        console.error("Erro no login:", error); // Exibe o erro no terminal
        return res.status(500).json({ message: "Erro no servidor", error });
      }
};

module.exports = { login, register };