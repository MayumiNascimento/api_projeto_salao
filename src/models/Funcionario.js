const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');


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
    hooks: { 
        //função para criptografar novamente a senha pós alteração
        beforeCreate: async (funcionario) => {
            if (funcionario.senha) {
                const salt = await bcrypt.genSalt(10); // Gera um salt
                funcionario.senha = await bcrypt.hash(funcionario.senha, salt); // Faz o hash da senha
            }
        },
        beforeUpdate: async (funcionario) => {
            if (funcionario.changed('senha')) { // Verifica se a senha foi alterada
                const salt = await bcrypt.genSalt(10);
                funcionario.senha = await bcrypt.hash(funcionario.senha, salt);
            }
        },
    },
});

    // Método para comparar senhas
    Funcionario.prototype.comparePassword = async function (senha) {
        return await bcrypt.compare(senha, this.senha);
    };


module.exports = Funcionario;