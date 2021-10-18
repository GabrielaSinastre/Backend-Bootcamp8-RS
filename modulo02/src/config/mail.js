export default {
  host: 'smtp.mailtrap.io', // enviar email atraves da smtp
  port: 2525,
  secure: false, // se é seguro ou não
  auth: {
    // autenticação do email
    user: 'e0e7164011c016',
    pass: 'a9a88c357440f2',
  },
  default: {
    from: 'Equipe GoBarber <noreply@gobarber.com>',
  },
};
