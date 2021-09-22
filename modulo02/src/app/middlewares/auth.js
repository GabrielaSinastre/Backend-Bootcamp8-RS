// middleware para verificar se um usuário está logado
// e se não estiver, algumas ações são limitadas.
import jwt from 'jsonwebtoken';

import { promisify } from 'util'; // pega uma função de callback e transforma numa função async/await
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // se esse middleware não estiver presente, já retorna um erro nesse if
  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }
  // dividir a Bearer do token, pois precisamos apenas do token
  // split: vai retornar o Bearer separado pois a regra ' ' conta até o espaço para dividir
  // quando usa { , token }, ele descarta o bearer e pega a segunda informação que é o token
  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    // eslint-disable-next-line no-console
    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
