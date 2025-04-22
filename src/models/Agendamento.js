const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Funcionario = require('../models/Funcionario');


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
        type: DataTypes.DECIMAL(10,2),
    },
    total: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
    }
}, {
    tableName: 'agendamentos',
    timestamps: true, 
});
//Associação com o modelo Servico
Agendamento.associate = (models) => {
    Agendamento.belongsToMany(models.Servico, {
        through: models.Agendamentos_itens,
        foreignKey: 'agendamento_id',
        otherKey: 'servico_id',
        as: 'Servicos'
    });
}
// Associação com o modelo Funcionario
Agendamento.belongsTo(Funcionario, { foreignKey: 'funcionario_id', as: 'Funcionario' });

module.exports = Agendamento;