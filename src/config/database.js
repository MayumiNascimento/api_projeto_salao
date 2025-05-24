require("dotenv").config({ path: "../.env" });
const { Sequelize } = require('sequelize');

// Configurações de conexão
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: process.env.DB_DIALECT,
      port: process.env.DB_PORT,
      dialectOptions: {
      ssl: {
        require: true,       // Obrigatório
        rejectUnauthorized: false // Permite certificados autoassinados (pode remover se tiver certificado válido)
      }
      },
      logging: false,
    }
  );
// Testar a conexão
sequelize.authenticate()
    .then(() => {
        console.log('Conectado ao MySQL com Sequelize!');
    })
    .catch((err) => {
        console.error('Erro ao conectar ao MySQL:', err);
    });

module.exports = sequelize;