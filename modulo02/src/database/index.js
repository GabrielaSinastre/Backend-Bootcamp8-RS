// arquivo para iniciar a conexão com o banco de dados e conectar com os models

import { Sequelize } from 'sequelize';
import databaseConfig from '../config/database'; // importar as config do banco de dados

// importar os models:
import User from '../app/models/User';

const models = [User]; // importar todos os models da aplicação em um array

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig); // o init do model esta esperando esse comando
    // retornar/exportar um model:
    models.map((model) => model.init(this.connection));
  }
}

export default new Database();
