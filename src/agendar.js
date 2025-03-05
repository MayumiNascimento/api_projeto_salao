const cron = require('node-cron');
const Agendamento = require('./models/Agendamento');
const Servico = require('./models/Servico');
const { enviarLembreteWhatsApp } = require('./services/whatsappService');

// Função para enviar lembretes
const enviarLembretes = async () => {
    const agora = new Date();

    //horários de envio
    const horarioManha = new Date(agora);
    horarioManha.setHours(8, 0, 0, 0); // 8h da manhã

    const horarioNoite = new Date(agora);
    horarioNoite.setHours(20, 0, 0, 0); // 20h da noite


    // Verifica a hora de enviar os lembretes
    if (agora.getHours() === 8 && agora.getMinutes() === 0) {
        // Envia lembretes para agendamentos a partir das 12h
        const agendamentosTarde = await Agendamento.findAll({
            where: {
                dia: agora.toISOString().split('T')[0], // Dia do agendamento
                hora: { [Op.gte]: '12:00' }, // a partir das 12h
                status: 'agendado', // Apenas agendamentos ativos
            },
            include: [{ model: Servico, attributes: ['nome'] }], // Inclui o nome do serviço
        });

        agendamentosTarde.forEach((agendamento) => {
            const nomeServico = agendamento.Servico.nome;
            const mensage = `Olá ${agendamento.cliente_nome}, você tem um agendamento para ${nomeServico} às ${agendamento.hora}. \nEsperamos você!`;
            enviarLembreteWhatsApp(agendamento.cliente_telefone, mensage);
        });
    } else if (agora.getHours() === 20 && agora.getMinutes() === 0) {
        // Envia lembretes para agendamentos da manhã (antes das 12h)
        const amanha = new Date(agora);
        amanha.setDate(agora.getDate() + 1); // Dia seguinte

        const agendamentosManha = await Agendamento.findAll({
            where: {
                dia: amanha.toISOString().split('T')[0], // Dia do agendamento (dia seguinte)
                hora: { [Op.lt]: '12:00' }, // Hora antes das 12h
                status: 'agendado', // Apenas agendamentos ativos
            },
            include: [{ model: Servico, attributes: ['nome'] }], // Inclui o nome do serviço
        });

        agendamentosManha.forEach((agendamento) => {
            const nomeServico = agendamento.Servico.nome;
            const mensage = `Olá ${agendamento.cliente_nome}, você tem um agendamento para ${nomeServico} às ${agendamento.hora} amanhã. \nEsperamos você!`;
            enviarLembreteWhatsApp(agendamento.cliente_telefone, mensage);
        });
    }
};

// Agenda a execução da função 
//cron.schedule('0 8,20 * * *', enviarLembretes); // Envia lembretes às 8h da manhã e às 20h da noite
cron.schedule('* * * * *', enviarLembretes); // Executa a cada minuto (para testes)