// esse arquivo para que a fila rode sem interferir na performance da aplicação
// ela pode rodar em um outro servidor
import 'dotenv/config';
import Queue from './lib/Queue';

Queue.processQueue();
