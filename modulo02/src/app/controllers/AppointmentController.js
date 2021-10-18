import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';
import Notification from '../schemas/Notification';

import Mail from '../../lib/Mail';

// controler que marca o agendamento de um cliente no banco de dados
class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      // ordenar os agendamentos:
      order: ['date'],
      limit: 20, // limite de registros por pagina
      offset: (page - 1) * 20, // quantos registros eu quero pular
      attributes: ['id', 'date'],
      // inserir os dados do prestador de serviço
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });
    return res.json(appointments);
  }

  async store(req, res) {
    // post
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });
    // verificar se os campos seguem os padroes pedidos
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { provider_id, date } = req.body;

    // verificar se o provider_id é um provider mesmo
    const checkisProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    // se não for um provider
    if (!checkisProvider) {
      return res
        .status(401)
        .json({ error: 'You can only create appointments with providers' });
    }

    // verificar se a data que está tentando agendar não passou ainda, se é valida
    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      // se o hourStart está antes da data atual
      // ou seja a data que ele esta tentando usar ja passou
      res.status(400).json({ error: 'Paste dates are not permited' });
    }

    // verificar se a data de agendamento não está sendo utilizada
    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkAvailability) {
      // se ele encontrou um horario no if anterior, significa q o horario ja esta marcado, indisponivel
      return res
        .status(400)
        .json({ error: 'Appointment date is not avaliable' });
    }

    // criar o agendamento depois de verificar o provider
    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date,
    });

    // notificar o prestador de serviço quando for criado um agendamento
    const user = await User.findByPk(req.userId);
    const formatedDate = format(hourStart, "'dia' dd 'de' MMMM', às' H:mm'h'", {
      locale: pt,
    });
    await Notification.create({
      content: `Novo agendamento de ${user.name} para ${formatedDate}`,
      user: provider_id,
    });

    return res.json(appointment);
  }

  async delete(req, res) {
    // o usuario pode deletar um agendamento que ele fez ate 2hrs antes
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          // qual provider vai mandar o email basicamente
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });

    // ver se o id é diferente do usuario que está logado, se for diferente tem que limitar ele
    // pois se ele não é dono do agendamento, ele não pode cancelar ele
    if (appointment.user_id !== req.userId) {
      return res.status(401).json({
        error: "'You don't have permission to cancel this appointment.'",
      });
    }

    const dateWithSub = subHours(appointment.date, 2);
    // diminuir 2horas do datewithsub
    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({
        error: 'You can only cancel appointments 2 hours in advance.',
      });
    }
    // setar o campo do agendamento cancelado como a data do momento em que foi cancelado
    appointment.canceled_at = new Date();

    await appointment.save();

    await Mail.sendMail({
      to: `${appointment.provider.name} < ${appointment.provider.email}>`,
      subject: 'Agendamento Cancelado',
      template: 'cancellation',
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(appointment.date, "'dia' dd 'de' MMMM', às' H:mm'h'", {
          locale: pt,
        }),
      },
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
