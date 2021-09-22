/* eslint-disable prettier/prettier */
import { Router } from 'express';
/* exportar apenas o router e esse de cima é a mesma coisa que:
const { Router } = require('express'); */
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware); // todas as rotas depois dessa vai passar pelo middleware
routes.put('/users', UserController.update);

export default routes; // esse de cima é a mesma coisa: module.exports = routes;
