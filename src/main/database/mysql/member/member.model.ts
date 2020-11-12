import { BuildOptions, DataTypes, Model } from 'sequelize';
import sequelize from '../../../../configs/sequelize';

export interface Member extends Model {
  readonly id: number;
  name: string;
}

export type MemberModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): Member;
};

const MemberModel = sequelize.define(
  'member',
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
) as MemberModelStatic;

export default MemberModel;
