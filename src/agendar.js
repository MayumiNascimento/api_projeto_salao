const cron = require('node-cron');
const { Op } = require('sequelize');
const Agendamento = require('./models/Agendamento');
const Servico = require('./models/Servico');
const { enviarLembreteWhatsApp } = require('./services/whatsappService');

// Lembretes da tarde (enviados às 8h do mesmo dia)
const lembretesTarde = async () => {
    const hoje = new Date().toISOString().split('T')[0];

    const agendamentos = await Agendamento.findAll({
        where: {
            dia: hoje,
            hora: { [Op.gte]: '12:00' },
            status: 'agendado',
        },
        include: [{ model: Servico, attributes: ['nome'] }],
    });

    agendamentos.forEach((agendamento) => {
        const nomesServicos = agendamento.Servicos.map(s => s.nome).join(', ');
        const msg = `Olá ${agendamento.cliente_nome}, você tem um agendamento para ${nomesServicos} 
                        às ${agendamento.hora}. \nEsperamos você!`;
        enviarLembreteWhatsApp(agendamento.cliente_telefone, msg);
    });
};

// Lembretes da manhã (enviados às 20h do dia anterior)
const lembretesManha = async () => {
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    const diaAmanha = amanha.toISOString().split('T')[0];

    const agendamentos = await Agendamento.findAll({
        where: {
            dia: diaAmanha,
            hora: { [Op.lt]: '12:00' },
            status: 'agendado',
        },
        include: [{ model: Servico, attributes: ['nome'] }],
    });

    agendamentos.forEach((agendamento) => {
        const nomesServicos = agendamento.Servicos.map(s => s.nome).join(', ');
        const msg = `Olá ${agendamento.cliente_nome}, você tem um agendamento para ${nomesServicos} 
                    às ${agendamento.hora} amanhã. \nEsperamos você!`;
        enviarLembreteWhatsApp(agendamento.cliente_telefone, msg);
    });
};

// Agenda os lembretes
cron.schedule('0 8 * * *', lembretesTarde ,{
  timezone: 'America/Sao_Paulo'
});  // 8h 

cron.schedule('0 20 * * *', lembretesManha, {
  timezone: 'America/Sao_Paulo'
}); // 20h 