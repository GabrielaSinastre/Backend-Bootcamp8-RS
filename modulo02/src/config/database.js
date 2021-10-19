require('dotenv/config');

module.exports = {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  define: {
    timestamps: true, // registra as acoes do banco
    underscored: true, // padronização de tabelas e colunas
    underscoredAll: true,
  },
};
