import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    // como se tivesse declarando uma variavel key dentro desse método
    // quando importar desse arquivo, pode usar CancellationMail.key e acessar essa prorpiedade
    // serve para obter variaves de facil acesso sem ter que criar um constructor
    return 'CancellationMail';
    // retorna uma chave unica para cada job
  }

  async handle({ data }) {
    // essa tarefa sera executada quando esse processo estiver sendo executado
    // hancle é chamado no envio de cada email, onde está o codigo de envio

    const { appointment } = data;
    // eslint-disable-next-line no-console
    console.log('A fila executou');
    await Mail.sendMail({
      to: `${appointment.provider.name} < ${appointment.provider.email}>`,
      subject: 'Agendamento Cancelado',
      template: 'cancellation',
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(
          parseISO(appointment.date),
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new CancellationMail();
