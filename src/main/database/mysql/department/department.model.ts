import { BuildOptions, DataTypes, Model } from 'sequelize';
import sequelize from '../../../../configs/sequelize';
import CEOModel from '../ceo/ceo.model';

export interface Department extends Model {
  readonly id: number;
  ceoId: number;
  manager: string;
}

export type DepartmentModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): Department;
};

const DepartmentModel = sequelize.define(
  'department',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ceoId: {
      type: DataTypes.INTEGER,
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      references: {
        model: CEOModel,
        key: 'id',
      },
    },
    manager: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  },
) as DepartmentModelStatic;

/*
association with CEO table
*/
CEOModel.hasMany(DepartmentModel, {
  sourceKey: 'id',
  foreignKey: 'ceoId',
  as: 'departments',
});

DepartmentModel.belongsTo(CEOModel, {
  targetKey: 'id',
  foreignKey: 'ceoId',
  as: 'ceo',
});

export default DepartmentModel;
