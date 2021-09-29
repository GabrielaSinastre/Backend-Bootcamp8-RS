// arquivo responsável pelo upload de arquivos
import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path'; // extname é qual a extensão do arquivo, resolve para percorrer um caminho dentro da aplicacao

export default {
  storage: multer.diskStorage({
    // como o multer vai guardar os arquivos de imagem
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'), // destino dos arquivos
    filename: (req, file, cb) => {
      // crypto é uma biblioteca que gera caracteres aleatorios
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err); // cb é o call back, que vai retorar o nome do arquivo ou com erro
        return cb(null, res.toString('hex') + extname(file.originalname)); // null pq nao teve erro
      });
    },
  }),
};
