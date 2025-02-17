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
    timestamps: false, // Desativa os campos `createdAt` e `updatedAt`
});

module.exports = Servico;