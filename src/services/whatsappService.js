const venom = require('venom-bot');
let client;
let ioInstance = null;

const isWhatsAppConnected = () => {
  return !!client && client.isConnected();
};

const iniciarWhatsApp = async () => {
  try {
    console.log('Iniciando venom...');
    client = await venom.create({
      session: 'novo-agendamento-session',
      storageOptions: {
        folderName: './whatsapp-sessions', 
        saveSessions: true
        },
      multidevice: true,
      autoClose: 0, // Fecha a sessão após 60 segundos (0 para testes)
      createTimeout: 300000, // (5 minutos)
      catchQR: (base64Qr, asciiQR, attempts, urlCode) => {
         console.log('🟡 QR Code gerado');
        if (ioInstance) {
          ioInstance.emit('qrCode', base64Qr);
          ioInstance.emit('whatsappStatus', 'AGUARDANDO_QR'); 
        }
      },
      logQR: false,
      disableWelcome: true,
      updatesLog: false,
      browserArgs: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--single-process', 
        '--max-old-space-size=512',
        '--disable-blink-features=AutomationControlled' 
      ],
      executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium-browser'
    });

    if (!client) {
      console.error('Client não foi criado corretamente!');
      return;
    }

    // Detecta mudanças de estado e envia o status atual
    client.onStateChange((state) => {
      console.log('Estado atual do WhatsApp:', state);
      if (!ioInstance) return;

      switch (state) {
        case 'CONNECTED':
        case 'open':
          ioInstance.emit('whatsappStatus', 'CONNECTED');
          break;
        case 'DISCONNECTED':
        case 'TIMEOUT':
        case 'UNPAIRED':
        case 'UNPAIRED_IDLE':
        case 'CONFLICT':
          ioInstance.emit('whatsappStatus', 'DISCONNECTED');
          break;
        default:
          ioInstance.emit('whatsappStatus', state);
      }
    });

    // Checagem periódica de conexão
    setInterval(async () => {
      try {
        const conectado  = await client.isConnected();
        console.log('Verificação isConnected:', conectado);

      if (!conectado) {
        console.warn('WhatsApp desconectado. Tentando reconectar...');
        await iniciarWhatsApp();
      }

        if (ioInstance) {
          ioInstance.emit('whatsappStatus', conectado ? 'CONNECTED' : 'DISCONNECTED');
        }
      } catch (err) {
        ioInstance.emit('whatsappStatus', 'DISCONNECTED');
      }
    }, 1800000); // 30 minutos
  } catch (error) {
    console.error('Erro ao conectar ao WhatsApp:', error);
    if (ioInstance) {
      ioInstance.emit('whatsappStatus', 'ERRO_CONEXAO');
    }
    setTimeout(iniciarWhatsApp, 10000);
  }

};

// Função de envio
const enviarLembreteWhatsApp = async (telefone, mensagem) => {
  if (!client) {
    console.error('WhatsApp não está conectado.');
    return;
  }

  try {
    await client.sendText(`${telefone}@c.us`, mensagem);
    console.log(`Lembrete enviado para ${telefone}: ${mensagem}`);
  } catch (error) {
    console.error('Erro ao enviar lembrete:', error);
  }
};

// Função para conectar o Socket.io (server.js)
const setSocketInstance = (io) => {
  ioInstance = io;
};

module.exports = { iniciarWhatsApp, enviarLembreteWhatsApp, setSocketInstance, isWhatsAppConnected };