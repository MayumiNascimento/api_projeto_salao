const Agendamento = require('./Agendamento');
const Servico = require('./Servico');
const Agendamentos_itens = require('./Agendamentos_itens');
const Funcionario = require('./Funcionario');

// associações
Agendamento.associate({ Agendamentos_itens, Servico, Funcionario });
Servico.associate({ Agendamentos_itens, Agendamento });
Funcionario.associate({ Agendamento });

module.exports = {
    Agendamento,
    Servico,
    Agendamentos_itens,
    Funcionario,
};