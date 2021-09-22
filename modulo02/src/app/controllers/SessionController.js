import jwt from 'jsonwebtoken';
import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
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
