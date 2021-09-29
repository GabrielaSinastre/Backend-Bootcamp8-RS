import { DataTypes, Model } from 'sequelize';

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        // super vem da classe pai Model
        name: DataTypes.STRING,
        path: DataTypes.STRING,
      },
      {
        sequelize,
      }
    );
    return this;
  }
}

export default File;
