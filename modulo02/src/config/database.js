/* eslint-disable prettier/prettier */
module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'gobarber',
  define: {
    timestamps: true, // registra as acoes do banco
    underscored: true, // padronização de tabelas e colunas
    underscoredAll: true,
  },
};
