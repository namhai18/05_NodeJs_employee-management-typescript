import faker from 'faker';
import STATUS_CODE from 'http-status';
import times from 'lodash.times';
import { HTTPdata } from '../../../configs/interfaces';
import { CEO } from '../../database/mysql/ceo/ceo.model';
import { Department } from '../../database/mysql/department/department.model';
import { Member } from '../../database/mysql/member/member.model';
import { Team } from '../../database/mysql/team/team.model';
import MYSQL from '../../database/mysql/mysqlService';

class CommonController {
  /** ================================================================================== */
  public createCEO = async (
    numberOfDepartment?: number | null,
    numberOfTeamPerDepartment?: number | null,
    numberOfMember?: number | null,
  ) => {
    const results = {
      code: 0,
      message: '',
      data: null,
    } as HTTPdata;

    try {
      /** check input */
      if (!numberOfDepartment) {
        results.code = STATUS_CODE.PRECONDITION_FAILED;
        results.message = 'please input numberOfDepartment';
        return results;
      }
      if (!numberOfTeamPerDepartment) {
        results.code = STATUS_CODE.PRECONDITION_FAILED;
        results.message = 'please input numberOfTeamPerDepartment';
        return results;
      }
      if (!numberOfMember) {
        results.code = STATUS_CODE.PRECONDITION_FAILED;
        results.message = 'please input numberOfTeamPerDepartment';
        return results;
      }

      const promises: any[] = [];

      /** ceo */
      const ceo = await MYSQL.ceoService.createOne({
        name: faker.name.firstName(),
      });

      /** department */
      for (let i = 0; i < numberOfDepartment; i++) {
        const department = (await MYSQL.departmentService.createOne(
          {
            ceoId: ceo.id,
            manager: faker.name.firstName(),
          },
          null,
        )) as Department;

        /** team */
        for (let i = 0; i < numberOfTeamPerDepartment; i++) {
          promises.push(
            MYSQL.teamService.createOne(
              {
                departmentId: department.id,
                project: faker.commerce.productName(),
              },
              null,
            ),
          );
        }
      }

      await Promise.all(promises);

      results.code = STATUS_CODE.OK;
      results.message = 'successfully';
      results.data = ceo;
      return results;
    } catch (err) {
      results.code = STATUS_CODE.INTERNAL_SERVER_ERROR;
      results.message = err.toString();
      results.data = err;
      return results;
    }
  };

  /** ================================================================================== */
  public createMembers = async (numberOfMember: number) => {
    const results = {
      code: 0,
      message: '',
      data: null,
    } as HTTPdata;

    try {
      const member = await MYSQL.memberService.createMany(
        times(numberOfMember, () => ({
          name: faker.name.firstName(),
        })),
      );

      results.code = STATUS_CODE.OK;
      results.message = 'successfully';
      results.data = member;
      return results;
    } catch (err) {
      results.code = STATUS_CODE.INTERNAL_SERVER_ERROR;
      results.message = err.toString();
      results.data = err;
      return results;
    }
  };

  /** ================================================================================== */
  public createTeamMembers = async () => {
    const results = {
      code: 0,
      message: '',
      data: null,
    } as HTTPdata;

    try {
      const teams = await MYSQL.teamService.findMany({
        attributes: ['id'],
      });

      const members = await MYSQL.memberService.findMany({
        attributes: ['id'],
      });

      const dataList: any[] = [];
      for (const team of teams) {
        for (const member of members) {
          const data = {
            teamId: team.id,
            memberId: member.id,
          };
          dataList.push(data);
        }
      }

      MYSQL.teamMemberService.createMany(dataList);

      results.code = STATUS_CODE.OK;
      results.message = 'successfully';
      return results;
    } catch (err) {
      results.code = STATUS_CODE.INTERNAL_SERVER_ERROR;
      results.message = err.toString();
      results.data = err;
      return results;
    }
  };
}

const commonController = new CommonController();

export default commonController;
