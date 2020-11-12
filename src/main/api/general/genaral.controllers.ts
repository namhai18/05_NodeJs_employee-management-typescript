import STATUS_CODE from 'http-status';
import { HTTPdata } from '../../../configs/interfaces';
import { CEO } from '../../database/mysql/ceo/ceo.model';
import DepartmentModel, { Department } from '../../database/mysql/department/department.model';
import MemberModel from '../../database/mysql/member/member.model';
import TeamMemberModel, { TeamMember } from '../../database/mysql/team.member/team.member.model';
import TeamModel, { Team } from '../../database/mysql/team/team.model';
import MYSQL from '../../database/mysql/mysqlService';

class GeneralController {
  /** ================================================================================== */
  public getMembersInTreeModel = async () => {
    const results = {
      code: 0,
      message: '',
      data: null,
    } as HTTPdata;

    try {
      /** get data */
      const data = await MYSQL.ceoService.findManyAndCount({
        attributes: ['name'],
        include: [
          {
            model: DepartmentModel,
            as: 'departments',
            required: true,
            attributes: ['manager'],
            include: [
              {
                model: TeamModel,
                as: 'teams',
                required: true,
                attributes: ['project'],
                include: [
                  {
                    model: TeamMemberModel,
                    as: 'teamMembers',
                    required: true,
                    attributes: ['id'],
                    include: [
                      {
                        model: MemberModel,
                        as: 'member',
                        attributes: ['name'],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });

      /** return responses */
      if (data.rows && data.rows.length > 0) {
        results.code = STATUS_CODE.OK;
        results.message = 'successfully';
        results.data = {
          number: data.count,
          ceos: data.rows,
        };
        return results;
      } else {
        results.code = STATUS_CODE.PRECONDITION_FAILED;
        results.message = 'no result';
        results.data = [];
        return results;
      }
    } catch (err) {
      results.code = STATUS_CODE.INTERNAL_SERVER_ERROR;
      results.message = err.toString();
      results.data = err;
      return results;
    }
  };

  /** ================================================================================== */
  public getLimit1500Members = async () => {
    const results = {
      code: 0,
      message: '',
      data: null,
    } as HTTPdata;

    try {
      let memberNumber = 0;

      /** get ceo */
      const ceo = await MYSQL.ceoService.findOne({
        attributes: ['id', 'name'],
      });

      if (!ceo) {
        results.code = STATUS_CODE.PRECONDITION_FAILED;
        results.message = 'ceo not found';
        return results;
      }

      /** get the list of department manager */
      const departmentList = await MYSQL.departmentService.findMany({
        attributes: ['id', 'manager'],
        where: { ceoId: ceo.id },
      });

      /** get the list of team for each department manager */
      let teamList: Team[] = [];
      for (const department of departmentList) {
        const teams = await MYSQL.teamService.findMany({
          attributes: ['id', 'project'],
          where: { departmentId: department.id },
        });
        teamList = teamList.concat(teams);
      }

      /** get the list of team member for each team */
      let teamMemberList: TeamMember[] = [];
      for (const team of teamList) {
        const teamMembers = await MYSQL.teamMemberService.findMany({
          attributes: ['id'],
          where: { teamId: team.id },
          include: [
            {
              model: MemberModel,
              as: 'member',
              attributes: ['id', 'name'],
            },
          ],
        });
        teamMemberList = teamMemberList.concat(teamMembers);
      }

      /** calculate total number of members */
      memberNumber += 1;
      memberNumber += departmentList.length;
      memberNumber += teamMemberList.length;

      /** limit to 1500 members */
      if (memberNumber > 1500) {
        teamMemberList.splice(1500 - departmentList.length - 1);
        memberNumber = 0;
        memberNumber += 1;
        memberNumber += departmentList.length;
        memberNumber += teamMemberList.length;
      }

      /** return responses */
      results.code = STATUS_CODE.OK;
      results.message = 'successfully';
      results.data = { memberNumber, ceo, departmentList, teamList, teamMemberList };
      return results;
    } catch (err) {
      results.code = STATUS_CODE.INTERNAL_SERVER_ERROR;
      results.message = err.toString();
      results.data = err;
      return results;
    }
  };
}

const generalController = new GeneralController();

export default generalController;
