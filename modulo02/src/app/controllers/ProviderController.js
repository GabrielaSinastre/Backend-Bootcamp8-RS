import User from '../models/User';
import File from '../models/File';
// controller para gerenciar aquele que fornece o serviço
class ProviderController {
  async index(req, res) {
    const providers = await User.findAll({
      // colocar o parametro where, para filtrar, senao ele vai retornar todos os tipos de users
      where: { provider: true },
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'], // pegar so as informações que eu quero
        },
      ],
    });

    return res.json(providers);
  }
}

export default new ProviderController();
