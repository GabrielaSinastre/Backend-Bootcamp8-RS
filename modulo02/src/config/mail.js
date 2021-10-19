export default {
  host: process.env.MAIL_HOST, // enviar email atraves da smtp
  port: process.env.MAIL_PORT,
  secure: false, // se é seguro ou não
  auth: {
    // autenticação do email
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  default: {
    from: 'Equipe GoBarber <noreply@gobarber.com>',
  },
};
