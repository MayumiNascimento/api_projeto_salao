const venom = require('venom-bot');
let client;
let ioInstance = null;

const iniciarWhatsApp = async () => {
  try {
    client = await venom.create({
      session: 'agendamento-session',
      multidevice: false,
      catchQR: (base64Qr, asciiQR, attempts, urlCode) => {
        if (ioInstance) {
          ioInstance.emit('qrCode', base64Qr);
          ioInstance.emit('whatsappStatus', 'AGUARDANDO_QR');
          console.log('QR Code enviado para o frontend!');
        }
      },
      logQR: false,
      disableWelcome: true,
      updatesLog: false,
    });

    console.log('WhatsApp iniciado, aguardando conexão...');

    // Escuta mudanças no estado da conexão
    client.onStateChange((state) => {
      console.log('Estado atual do WhatsApp:', state);

      if (ioInstance) {
        if (state === 'CONNECTED') {
          ioInstance.emit('whatsappStatus', 'CONNECTED');
        } else if (state === 'DISCONNECTED') {
          ioInstance.emit('whatsappStatus', 'DISCONNECTED');
        } else if (state === 'TIMEOUT') {
          ioInstance.emit('whatsappStatus', 'TIMEOUT');
          // opcional: reconectar
          console.warn('WhatsApp desconectado por TIMEOUT. Tentando reconectar...');
          iniciarWhatsApp();
        } else {
          ioInstance.emit('whatsappStatus', state); // para lidar com outros estados
        }
      }
    });

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

module.exports = { iniciarWhatsApp, enviarLembreteWhatsApp, setSocketInstance };