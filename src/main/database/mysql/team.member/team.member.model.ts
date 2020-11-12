import { BuildOptions, DataTypes, Model } from 'sequelize';
import sequelize from '../../../../configs/sequelize';
import MemberModel from '../member/member.model';
import TeamModel from '../team/team.model';

export interface TeamMember extends Model {
  readonly id: number;
  teamId: number;
  memberId: number;
}

export type TeamMemberModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): TeamMember;
};

const TeamMemberModel = sequelize.define(
  'team_member',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    teamId: {
      type: DataTypes.INTEGER,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      references: {
        model: TeamModel,
        key: 'id',
      },
    },
    memberId: {
      type: DataTypes.INTEGER,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      references: {
        model: MemberModel,
        key: 'id',
      },
    },
  },
  {
    timestamps: false,
  },
) as TeamMemberModelStatic;

/*
association with Team table
*/
TeamModel.hasMany(TeamMemberModel, {
  sourceKey: 'id',
  foreignKey: 'teamId',
  as: 'teamMembers',
});

TeamMemberModel.belongsTo(TeamModel, {
  targetKey: 'id',
  foreignKey: 'teamId',
  as: 'team',
});

/*
association with Member table
*/
MemberModel.hasMany(TeamMemberModel, {
  sourceKey: 'id',
  foreignKey: 'memberId',
  as: 'teamMembers',
});

TeamMemberModel.belongsTo(MemberModel, {
  targetKey: 'id',
  foreignKey: 'memberId',
  as: 'member',
});

export default TeamMemberModel;
