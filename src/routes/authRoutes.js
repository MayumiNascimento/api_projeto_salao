const express = require('express');
const authController = require('../controllers/authController');
const { sendEmail } = require('../services/mailer');
const Funcionario = require('../models/Funcionario')
const jwt = require('jsonwebtoken');

const router = express.Router();

// Rota de registro //excluir após o cadastro do primeiro registro
router.post('/register', authController.register);

// Rota de login
router.post('/login', authController.login);


// Rota para solicitar recuperação de senha
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
  
    try {

      // Verifica se o funcionário existe
      const funcionario = await Funcionario.findOne({ where: { email } });
      if (!funcionario) {
        return res.status(404).json({ message: 'Funcionário não encontrado' });
      }
  
      // Gere um token de redefinição de senha (expira em 1 hora)
      const token = jwt.sign({ funcionarioId: funcionario.id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
  
      // Link de redefinição de senha
      const resetLink = `http://localhost:3000/reset-password?token=${token}`; //alterar apos publicar
  
      // Envie o e-mail
      await sendEmail(
        email,
        'Redefinição de Senha',
        `Clique no link abaixo para redefinir sua senha:\n\n${resetLink}`
      );
  
      res.status(200).json({ message: 'E-mail de recuperação enviado' });
    } catch (error) {
      console.error('Erro:', error);
      res.status(500).json({ message: 'Erro ao processar a solicitação' });
    }
  });
  
  // Rota para redefinir a senha
  router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
  
    try {
      // Verifique o token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const funcionarioId = decoded.funcionarioId;
  
      // Atualize a senha do funcionário
      const funcionario = await Funcionario.findByPk(funcionarioId);
      if (!funcionario) {
        return res.status(404).json({ message: 'Funcionário não encontrado' });
      }
  
      // Atualize a senha (use bcrypt para hash da senha antes de salvar)
      funcionario.senha = newPassword; // Lembre-se de fazer o hash da senha antes de salvar
      await funcionario.save();
  
      res.status(200).json({ message: 'Senha redefinida com sucesso' });
    } catch (error) {
      console.error('Erro:', error);
      res.status(500).json({ message: 'Erro ao redefinir a senha' });
    }
  });

module.exports = router;