const venom = require('venom-bot');

let client;

// Função para inicializar o Venom-Bot
const iniciarWhatsApp = async () => {
    try {
        client = await venom.create({
            session: 'agendamento-session',
            multidevice: false, //não será multi-dispositivo
        });
        console.log('WhatsApp conectado com sucesso!');
    } catch (error) {
        console.error('Erro ao conectar ao WhatsApp:', error);
    }
};

// Função para enviar mensagem via WhatsApp
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

// Inicia a conexão ao iniciar o serviço
iniciarWhatsApp();

module.exports = { enviarLembreteWhatsApp };