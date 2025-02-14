require("dotenv").config({ path: "../.env" });

const express = require('express');
const cors = require("cors");

const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(express.json());
app.use(cors());


// Rotas de autenticação
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});