const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Funcionario = sequelize.define('Funcionario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    senha: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    especialidade: {
        type: DataTypes.STRING(100),
    },
    tipo: {
        type: DataTypes.ENUM('funcionario', 'admin'),
        allowNull: false,
    },
    comissao: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 0, // Comissão não pode ser negativa
        },
    },
}, {
    tableName: 'funcionarios',
    timestamps: false, 
});

module.exports = Funcionario;