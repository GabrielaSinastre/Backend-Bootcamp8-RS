import nodemailer from 'nodemailer';
import { resolve } from 'path';
import exphbs from 'express-handlebars';
import nodemailerhbs from 'nodemailer-express-handlebars';
import mailConfig from '../config/mail';

class Mail {
  constructor() {
    const { host, port, secure, auth } = mailConfig;

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null, // verificar se tem um usuario, se nao passa ele como nulo
    });

    this.configureTemplates();
  }

  configureTemplates() {
    // configurar os templates que estarão dentro da pasta views
    const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails');
    // compile - como ele vai compilar, formatar os templates
    this.transporter.use(
      'compile',
      nodemailerhbs({
        viewEngine: exphbs.create({
          layoutsDir: resolve(viewPath, 'layouts'),
          partialsDir: resolve(viewPath, 'partials'),
          defaultLayout: 'default',
          extname: '.hbs',
        }),
        viewPath,
        extName: '.hbs',
      })
    );
  }

  sendMail(message) {
    return this.transporter.sendMail({
      // pegar todos os dados do mail config que esta sendo exportado
      ...mailConfig.default,
      ...message,
    });
  }
}

export default new Mail();
