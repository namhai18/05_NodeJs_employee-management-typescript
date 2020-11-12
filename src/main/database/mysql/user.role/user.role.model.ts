import { BuildOptions, DataTypes, Model } from 'sequelize';
import sequelize from '../../../../configs/sequelize';
import { User } from '../user/user.model';

export interface UserRole extends Model {
  readonly id: number;
  role: string;
  userList: User[];
}

export type UserRoleModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): UserRole;
};

const UserRoleModel = sequelize.define(
  'user_role',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: false,
  },
) as UserRoleModelStatic;

export default UserRoleModel;
