require("dotenv").config({ path: "../.env" });

const express = require('express');
const cors = require("cors");

const authRoutes = require('./routes/authRoutes');
const funcionarioRoutes = require('./routes/funcionarioRoutes');
const servicoRoutes = require('./routes/servicoRoutes');

const app = express();
app.use(express.json());
app.use(cors());


// Rotas de autenticação
app.use('/auth', authRoutes);
// Rotas de funcionários
app.use('/api', funcionarioRoutes);
// Rotas de serviços
app.use('/api', servicoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});