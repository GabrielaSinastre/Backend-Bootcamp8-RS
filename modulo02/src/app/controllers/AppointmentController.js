import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore } from 'date-fns';
import Appointment from '../models/Appointment';
import User from '../models/User';
// controler que marca o agendamento de um cliente no banco de dados
class AppointmentController {
  async store(req, res) {
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
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    // se não for um provider
    if (!isProvider) {
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

    return res.json(appointment);
  }
}

export default new AppointmentController();