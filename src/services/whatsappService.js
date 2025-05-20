
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
                    console.log('QR Code enviado para o frontend!');
                }
            },
            // Desativa o console QR
            logQR: false,
            disableWelcome: true,
            updatesLog: false
        });

        console.log('WhatsApp conectado com sucesso!');

         // Envia status da conexão ao frontend
          client.onStateChange((state) => {
            console.log(`Estado do WhatsApp: ${state}`);
            if (ioInstance) {
              ioInstance.emit('whatsappStatus', state); // Pode ser CONNECTED, CONFLICT e/ou TIMEOUT.
            }

      // Em caso de desconexão, pode tentar reconectar se desejar
      if (state === 'DISCONNECTED' || state === 'TIMEOUT') {
        console.warn('WhatsApp desconectado. Tentando reconectar...');
        iniciarWhatsApp();
      }
    });

    } catch (error) {
        console.error('Erro ao conectar ao WhatsApp:', error);
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
