import { DataTypes, Model, Sequelize } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        // super vem da classe pai Model
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: DataTypes.STRING,
        provider: DataTypes.BOOLEAN,
      },
      {
        sequelize,
      }
    );
    // hook = trechos de código que são executados de forma automatica baseado
    // em ações que acontecem no model, por exemplo, esse faz com que antes de qualquer
    // usuário ser salvno bd, esse trecho será executado de forma automática.
    this.addHook('beforeSave', async (user) => {
      // verificar se existe password_hash
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });
    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
