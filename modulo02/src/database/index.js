// arquivo para iniciar a conexão com o banco de dados e conectar com os models

import { Sequelize } from 'sequelize';
import mongoose from 'mongoose';
import databaseConfig from '../config/database'; // importar as config do banco de dados

// importar os models:
import User from '../app/models/User';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';

const models = [User, File, Appointment]; // importar todos os models da aplicação em um array

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig); // o init do model esta esperando esse comando
    // retornar/exportar um model:
    models.map((model) => model.init(this.connection));
    models.map(
      (model) => model.associate && model.associate(this.connection.models)
    );
  }

  mongo() {
    this.mongoConnection = mongoose.connect(
      'mongodb://localhost:27017/gobarber',
      { useNewUrlParser: true }
    );
  }
}

export default new Database();
