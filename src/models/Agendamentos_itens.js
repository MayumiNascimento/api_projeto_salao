const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Agendamentos_itens = sequelize.define('agendamentos_itens', {
    agendamento_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'agendamentos',
            key: 'id',
        },
    },
    servico_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'servicos',
            key: 'id',
        },
    },
}, {
    tableName: 'agendamentos_itens',
    timestamps: false,
});

module.exports = Agendamentos_itens