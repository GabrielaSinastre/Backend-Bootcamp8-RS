/* eslint-disable no-console */
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

  // permitir que o user faça alterações nos dados de cadastro dele
  async update(req, res) {
    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });
      // se ele não encontrar nenhum email, vai retornar null e nem vai entrar no if abaixo
      // se caso ele existir, entra no if
      if (userExists) {
        // se existir, bloquear o fluxo e retornar uma resposts
        return res.status(400).json({ error: 'User already exists.' }); // bad request
      }
    }

    // ver se a antiga senha bate com a que ele já tem
    // pode ser que ele n]ao queira alterar a senha, então verificar se ele passa a oldPassword
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match.' });
    }

    // depois das verificações, finalmente atualizar o usuário com os novos dados
    const { id, name, provider } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }
}

export default new UserController();
