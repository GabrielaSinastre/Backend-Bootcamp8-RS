import * as Yup from 'yup'; // para validar dados de entrada
import jwt from 'jsonwebtoken';
import User from '../models/User';
import authConfig from '../../config/auth';
// controller para gerenciar uma sessão com o token
class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      // required pq ele é obrigatorio
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    // ver se os dados do req.body estão sendo passados como eu quero acima
    if (!(await schema.isValid(req.body))) {
      // se retornar falso entra aqui dentro do if
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, password } = req.body;
    // verificar se o email é valido
    const user = await User.findOne({ where: { email } });

    // se o usuario não existe
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    // o usuario existe
    // verificar se as duas senhas não estão batendo (lá no model user tem esse metodo)
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match' });
    }
    // se chegou aqui a senha e o usuário estão ok
    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      // passa o id para ter o acesso ao usuario, uma string e as config como parametro
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn, // pega os dados do auth como parametro
      }),
    });
  }
}

export default new SessionController();
