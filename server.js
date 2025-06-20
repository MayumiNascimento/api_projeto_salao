require("dotenv").config();
require('./src/agendar'); // Inicia o automatizador de lembretes

const express = require('express');
const cors = require("cors");
const http = require("http");
const socketIo = require('socket.io');

const { iniciarWhatsApp, setSocketInstance, isWhatsAppConnected  } = require('./src/services/whatsappService');

const { Agendamento, Servico, Funcionario } = require('./src/models');

const authRoutes = require('./src/routes/authRoutes');
const funcionarioRoutes = require('./src/routes/funcionarioRoutes');
const servicoRoutes = require('./src/routes/servicoRoutes');
const agendamentoRoutes = require('./src/routes/agendamentoRoutes');
const relatorioRoutes = require("./src/routes/relatorioRoutes");
const adminDashboard = require("./src/routes/LoginAdminRoute");

const app = express();
const server = http.createServer(app); // Cria servidor HTTP com Express
const io = socketIo(server, {
    cors: {
      origin: process.env.FRONTEND_URL, 
      methods: ["GET", "POST"],
      credentials: true
    },
    pingInterval: 60000, // envia pings a cada 60s
    pingTimeout: 60000   // espera 60s por resposta
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

const sendHeartbeat = (socket) => {
  setTimeout(() => {
    socket.emit("ping", { beat: 1 });
    sendHeartbeat(socket); // loop infinito com delay
  }, 10000); // envia ping a cada 10 segundos
};

// WebSocket
io.on('connection', (socket) => {
  console.log(`Socket conectado: ${socket.id}`);
  sendHeartbeat(socket);

  // Resposta do cliente
  socket.on("pong", (data) => {
    console.log("Pong recebido do cliente:", data);
  });

  socket.on('disconnect', (reason) => {
    console.log(`Socket desconectado (${socket.id}): ${reason}`);
  });

  socket.on('reconnect_attempt', () => {
    console.log(`Tentando reconectar socket: ${socket.id}`);
  });
});

setSocketInstance(io);

// Inicia o WhatsApp após subir o servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, async () => {
  console.log(`Servidor unificado rodando na porta ${PORT}`);

  if (!isWhatsAppConnected()) {
      await iniciarWhatsApp();
  } else {
      console.log('WhatsApp já está conectado.');
    }
});

