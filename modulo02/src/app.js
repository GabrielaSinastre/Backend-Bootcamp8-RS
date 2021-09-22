/* eslint-disable prettier/prettier */
import express from 'express';
import routes from './routes';
/* esse de cima é a mesma coisa que:
const express = require('express');
const routes = require('./routes');
*/
import './database';

class App {
  // toda vez que chamar essa classe vai executar o metodo constructor
  constructor() {
    this.server = express(); // mesma coisa ao app que cadastrava o middleware, rotas

    this.middlewares(); // tem que chamar os middlewares senão eles não serão iniciados
    this.routes(); // tem que chamar as rotas senão elas não serão iniciadas
  }

  middlewares() {
    // cadastrar todos os middlewares da aplicação
    this.server.use(express.json());
  }

  routes() {
    // as rotas estarão no outro arquivo por isso faz dessa forma
    this.server.use(routes);
  }
}

// exportar uma nova instância de app e o server é a unica coisa que pode/precisa ser acessada
// fora do app,
export default new App().server;
/* esse de cima é a mesma coisa que:
module.exports = new App().server; */
