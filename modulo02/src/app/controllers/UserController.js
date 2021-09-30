/* eslint-disable no-console */
import * as Yup from 'yup'; // para validar dados de entrada
import User from '../models/User';
// controller para gerenciar os usuarios
class UserController {
  async store(req, res) {
    // cadastrar um usuario

    // para validar os dados de entrada
    // passa um objeto pq no req.body recebe um objeto e o shape é o tamanho dele
    const schema = Yup.object().shape({
      name: Yup.string().required(), // required pq ele é obrigatorio
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });

    // ver se os dados do req.body estão sendo passados como eu quero acima
    if (!(await schema.isValid(req.body))) {
      // se retornar falso entra aqui dentro do if
      return res.status(400).json({ error: 'Validation fails' });
    }

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
    const schema = Yup.object().shape({
      name: Yup.string(), // required pq ele é obrigatorio
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          // se o oldPassoword não for nullo/vazio, o field será required, ou seja, obrigatorio
          oldPassword ? field.required() : field
        ),
      // inserir um campo para confirmação dquela senha
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    // ver se os dados do req.body estão sendo passados como eu quero acima
    if (!(await schema.isValid(req.body))) {
      // se retornar falso entra aqui dentro do if
      return res.status(400).json({ error: 'Validation fails' });
    }

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
