require("dotenv").config({ path: "../.env" });
require('./agendar'); // Inicia o automatizador de lembretes

const express = require('express');
const cors = require("cors");

const authRoutes = require('./routes/authRoutes');
const funcionarioRoutes = require('./routes/funcionarioRoutes');
const servicoRoutes = require('./routes/servicoRoutes');
const agendamentoRoutes = require('./routes/agendamentoRoutes');

const app = express();
app.use(express.json());
app.use(cors());


// Rotas de autenticação
app.use('/auth', authRoutes);
// Rotas de funcionários
app.use('/api', funcionarioRoutes);
// Rotas de serviços
app.use('/api', servicoRoutes);
// Rotas de agendamentos
app.use('/api', agendamentoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});