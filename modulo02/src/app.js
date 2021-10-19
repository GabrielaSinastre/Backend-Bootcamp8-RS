import express from 'express';
import 'express-async-errors';
import path from 'path'; // para passar o caminho até a pasta de uploads
import Youch from 'youch';
import * as Sentry from '@sentry/node';
import sentryConfig from './config/sentry';
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
    Sentry.init(sentryConfig);

    this.middlewares(); // tem que chamar os middlewares senão eles não serão iniciados
    this.routes(); // tem que chamar as rotas senão elas não serão iniciadas
    // tratar exceções:
    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());
    // cadastrar todos os middlewares da aplicação
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    ); // recurso do express para tratar coisas estaticas como imagens
  }

  routes() {
    // as rotas estarão no outro arquivo por isso faz dessa forma
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    // criar o novo middleware para tratar as exceções
    // express reconhece que quando tem 4 parametros, ele é um middleware de exceção
    this.server.use(async (err, req, res, next) => {
      const errors = await new Youch(err, req).toJSON();
      return res.status(500).json(errors);
    });
  }
}

// exportar uma nova instância de app e o server é a unica coisa que pode/precisa ser acessada
// fora do app,
export default new App().server;
/* esse de cima é a mesma coisa que:
module.exports = new App().server; */
