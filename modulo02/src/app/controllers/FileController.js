import File from '../models/File';
// controller para adicionar um avatar no perfil do usuario
class FileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path,
    });

    res.json(file);
  }
}

export default new FileController();
