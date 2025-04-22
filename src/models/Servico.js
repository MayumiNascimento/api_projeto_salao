const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Servico = sequelize.define('Servico', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    categoria: {
        type: DataTypes.TEXT,
    },
    preco: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
}, {
    tableName: 'servicos',
    timestamps: false, 
});

Servico.associate = (models) => {
    Servico.belongsToMany(models.Agendamento, {
        through: models.Agendamentos_itens,
        foreignKey: 'servico_id',
        otherKey: 'agendamento_id',
        as: 'Agendamentos'
    });
};

module.exports = Servico;