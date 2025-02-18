const cron = require('node-cron');
const Agendamento = require('./models/Agendamento');
const { enviarLembreteWhatsApp } = require('./services/whatsappService');

// Função para enviar lembretes
const enviarLembretes = async () => {
    const agora = new Date();
    const horasAntes = 2; // Enviar lembrete 2 horas antes
    const horarioLembrete = new Date(agora.getTime() + horasAntes * 60 * 60 * 1000);

    // Busca agendamentos que estão próximos do horário
    const agendamentos = await Agendamento.findAll({
        where: {
            dia: horarioLembrete.toISOString().split('T')[0], // Dia do agendamento
            hora: horarioLembrete.toTimeString().split(' ')[0], // Hora do agendamento
            status: 'agendado', // Apenas agendamentos ativos
        },
    });

    // Envia lembretes para cada agendamento
    agendamentos.forEach((agendamento) => {
        const mensagem = `Olá ${agendamento.cliente_nome}, você tem um agendamento para ${agendamento.servico_id} às ${agendamento.hora}. Não se atrase!`;
        enviarLembreteWhatsApp(agendamento.cliente_telefone, mensagem);
    });
};

// Agenda a execução da função a cada minuto
cron.schedule('* * * * *', enviarLembretes); // Executa a cada minuto (para testes)