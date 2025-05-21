require("dotenv").config({ path: "../.env" });
require('./agendar'); // Inicia o automatizador de lembretes

const express = require('express');
const cors = require("cors");
const http = require("http");
const socketIo = require('socket.io');

const { iniciarWhatsApp, setSocketInstance, isWhatsAppConnected  } = require('./services/whatsappService');

const { Agendamento, Servico, Funcionario } = require('./models');

const authRoutes = require('./routes/authRoutes');
const funcionarioRoutes = require('./routes/funcionarioRoutes');
const servicoRoutes = require('./routes/servicoRoutes');
const agendamentoRoutes = require('./routes/agendamentoRoutes');
const relatorioRoutes = require("./routes/relatorioRoutes");
const adminDashboard = require("./routes/LoginAdminRoute");

const app = express();
const server = http.createServer(app); // Cria servidor HTTP com Express
const io = socketIo(server, {
    cors: {
      origin: "http://localhost:3001", 
      methods: ["GET", "POST"],
      credentials: true
    }
  });

// Middlewares
app.use(express.json());
app.use(cors());

// Rotas
app.use('/auth', authRoutes);
app.use('/api', funcionarioRoutes);
app.use('/api', servicoRoutes);
app.use('/api', agendamentoRoutes);
app.use("/api", relatorioRoutes);
app.use("/api", adminDashboard);

// WebSocket
io.on('connection', (socket) => {
  console.log(`Socket conectado: ${socket.id}`);

  socket.on('disconnect', (reason) => {
    console.log(`Socket desconectado (${socket.id}): ${reason}`);
  });

  socket.on('reconnect_attempt', () => {
    console.log(`Tentando reconectar socket: ${socket.id}`);
  });
});

setSocketInstance(io);

let whatsappInicializado = false;
// Inicia o WhatsApp após subir o servidor
const PORT = process.env.PORT || 3001;
server.listen(PORT, async () => {
  console.log(`Servidor unificado rodando na porta ${PORT}`);

  if (!isWhatsAppConnected()) {
      await iniciarWhatsApp();
  } else {
      console.log('WhatsApp já está conectado.');
    }
});
