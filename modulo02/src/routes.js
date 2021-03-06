/* eslint-disable prettier/prettier */
import { Router } from 'express';
/* exportar apenas o router e esse de cima é a mesma coisa que:
const { Router } = require('express'); */
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController';
import AvailableController from './app/controllers/AvailableController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware); // todas as rotas depois dessa vai passar pelo middleware
routes.put('/users', UserController.update);

routes.get('/providers', ProviderController.index); // para listar todos os prestadores desta aplicação
routes.get('/providers/:providerId/available', AvailableController.index); // retornar os horarios disponiveis para 1 provider

routes.get('/appointments', AppointmentController.index);
routes.post('/appointments', AppointmentController.store);
routes.delete('/appointments/:id', AppointmentController.delete);

routes.get('/schedule', ScheduleController.index);

routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);

routes.post('/files', upload.single('file'), FileController.store);

export default routes; // esse de cima é a mesma coisa: module.exports = routes;
