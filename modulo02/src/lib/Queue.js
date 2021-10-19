import Bee from 'bee-queue';
import CancellationMail from '../app/jobs/CancellationMail';
import redisConfig from '../config/redis';
// const que faz a mesma coisa quando chama as rotas no index.js
const jobs = [CancellationMail];
// todo trabalho que a fila faz é chamado de jobs
class Queue {
  constructor() {
    // cada tipo de serviço (background job) vai ter a sua própria fila
    this.queues = {};

    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
        // até aqui, pegou todas os jobs da aplicação e armazenando no this.queues
        // bee: armazena a fila, que possui conexão com o banco não relacional redis
        // armazena o método handle que vai processar todo o job
      };
    });
  }

  // método para adicionar novos jobs em cada fila
  // inicializando as filas
  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  // ja foram inicializadas, agora elas precisam ser processadas
  processQueue() {
    // para cada job, recebe o job em si (foreach)
    jobs.forEach((job) => {
      const { bee, handle } = this.queues[job.key]; // aqui eu consigo a fila e o método de processamento handle
      // processo failed significa que ele tentou todas as tentativas possiveis e falhou
      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    // eslint-disable-next-line no-console
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();
