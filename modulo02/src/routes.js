/* eslint-disable prettier/prettier */
import { Router } from 'express';
/* exportar apenas o router e esse de cima é a mesma coisa que:
const { Router } = require('express'); */

const routes = new Router();
routes.get('/', (req, res) => res.json({ message: 'Hello World' }));

export default routes; // esse de cima é a mesma coisa: module.exports = routes;
