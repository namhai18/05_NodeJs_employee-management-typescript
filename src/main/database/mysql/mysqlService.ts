import CEOService from './ceo/ceo.services';
import DepartmentService from './department/department.services';
import MemberService from './member/member.services';
import TeamMemberService from './team.member/team.member.services';
import TeamService from './team/team.services';
import UserRoleService from './user.role/user.role.services';
import UserService from './user/user.services';

class MYSQLService {
  public ceoService = new CEOService();
  public departmentService = new DepartmentService();
  public memberService = new MemberService();
  public teamService = new TeamService();
  public teamMemberService = new TeamMemberService();

  public userService = new UserService();
  public userRoleService = new UserRoleService();
}

const MYSQL = new MYSQLService();

export default MYSQL;
