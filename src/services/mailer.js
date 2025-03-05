const nodemailer = require('nodemailer');

// Configuração do transporte (Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, // Seu e-mail do Gmail
    pass: process.env.GMAIL_PASS, // Sua senha do Gmail
  },
});

// Função para enviar e-mail
const sendEmail = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: process.env.GMAIL_USER, // Remetente
      to, // Destinatário
      subject, // Assunto do e-mail
      text, // Corpo do e-mail (texto simples)
      html: `<p>${text}</p>`, // Corpo do e-mail (HTML)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('E-mail enviado:', info.response);
    return info;
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    throw error;
  }
};

module.exports = { sendEmail };