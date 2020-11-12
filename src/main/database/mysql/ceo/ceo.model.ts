import { BuildOptions, DataTypes, Model } from 'sequelize';
import sequelize from '../../../../configs/sequelize';

export interface CEO extends Model {
  readonly id: number;
  name: string;
}

export type CEOModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): CEO;
};

const CEOModel = sequelize.define(
  'ceo',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  },
) as CEOModelStatic;

export default CEOModel;
