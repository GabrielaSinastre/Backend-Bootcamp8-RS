import User from '../models/User';

class UserController {
  async store(req, res) {
    // cadastrar um usuario

    // verificar se ja existe o email que quero cadastrar
    const userExists = await User.findOne({ where: { email: req.body.email } });
    // se ele não encontrar nenhum email, vai retornar null e nem vai entrar no if abaixo
    // se caso ele existir, entra no if
    if (userExists) {
      // se existir, bloquear o fluxo e retornar uma resposts
      return res.status(400).json({ error: 'User already exists.' }); // bad request
    }

    const { id, name, email, provider } = await User.create(req.body);
    return res.json({
      id,
      name,
      email,
      provider,
    });
  }
}

export default new UserController();
