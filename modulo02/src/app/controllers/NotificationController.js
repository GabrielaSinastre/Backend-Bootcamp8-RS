import Notification from '../schemas/Notification';
import User from '../models/User';

class NotificationController {
  async index(req, res) {
    // essa rota só pode ser acessivel por prestadores de serviço
    const checkisProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });
    // se não for um provider
    if (!checkisProvider) {
      return res
        .status(401)
        .json({ error: 'You provide can load notifications' });
    }

    const notifications = await Notification.find({
      user: req.userId,
    })
      .sort({ createdAt: 'desc' })
      .limit(20);

    return res.json(notifications);
  }

  async update(req, res) {
    // definir uma notificação como lida
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    return res.json(notification);
  }
}

export default new NotificationController();
