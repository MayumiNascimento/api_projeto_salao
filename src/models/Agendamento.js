const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Funcionario = require('../models/Funcionario');
const Servico = require('../models/Servico');

const Agendamento = sequelize.define('Agendamento', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    cliente_nome: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    cliente_telefone: {
        type: DataTypes.STRING(15),
        allowNull: false,
    },
    servico_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    funcionario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    dia: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    hora: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('agendado', 'concluido', 'cancelado'),
        allowNull: false,
    },
    observacoes: {
        type: DataTypes.TEXT,
    },
    desconto: {
        type: DataTypes.FLOAT,
    },
}, {
    tableName: 'agendamentos',
    timestamps: false, // Habilita os campos `created_at` e `updated_at`
});

// Associação com o modelo Servico
Agendamento.belongsTo(Servico, { foreignKey: 'servico_id', as: 'Servico' });

// Associação com o modelo Funcionario
Agendamento.belongsTo(Funcionario, { foreignKey: 'funcionario_id', as: 'Funcionario' });

module.exports = Agendamento;