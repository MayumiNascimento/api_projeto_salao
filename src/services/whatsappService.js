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
      multidevice: true,
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
    });

    if (!client) {
      console.error('Client não foi criado corretamente!');
      return;
    }

    // Detecta mudanças de estado e envia o status atual
    client.onStateChange((state) => {
      console.log('📶 Estado atual do WhatsApp:', state);
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
        console.log('🔄 Verificação ativa - isConnected:', conectado);

        if (ioInstance) {
          ioInstance.emit('whatsappStatus', conectado ? 'CONNECTED' : 'DISCONNECTED');
        }
      } catch (err) {
        console.error('Erro ao verificar estado do WhatsApp:', err);
        ioInstance.emit('whatsappStatus', 'DISCONNECTED');
      }
    }, 3600000); // 1 hora
  } catch (error) {
    console.error('Erro ao conectar ao WhatsApp:', error);
    if (ioInstance) {
      ioInstance.emit('whatsappStatus', 'ERRO_CONEXAO');
    }
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