import STATUS_CODE from 'http-status';
import jsonwebtoken from 'jsonwebtoken';
import ENV from '../../../configs/env';
import { HTTPdata, UserInfo } from '../../../configs/interfaces';
import UserRoleModel from '../../database/mysql/user.role/user.role.model';
import { User } from '../../database/mysql/user/user.model';
import MYSQL from '../../database/mysql/mysqlService';

const Crypto = require('cryptojs').Crypto;

class AuthController {
  /** ================================================================================== */
  private getToken(user: User) {
    const payload = {
      id: user.id,
      username: user?.username,
      role: user?.userRole?.role,
    } as UserInfo;
    const secret = ENV.JWT_SECRET;
    const options = { expiresIn: ENV.JWT_EXPIRES_IN } as jsonwebtoken.SignOptions;
    const token = jsonwebtoken.sign(payload, secret, options);
    return token;
  }

  /** ================================================================================== */
  private comparePassword(loginPass: string, userEncodedPass: string) {
    const dencodedPass = Crypto.AES.decrypt(userEncodedPass, ENV.CRYPTO_SECRET);
    if (dencodedPass === loginPass) return true;
    else return false;
  }

  /** ================================================================================== */
  public login = async (username?: string | null, password?: string | null) => {
    const results = {
      code: 0,
      message: '',
      data: null,
    } as HTTPdata;

    try {
      /** chec input */
      if (!username) {
        results.code = STATUS_CODE.PRECONDITION_FAILED;
        results.message = 'username is missing';
        return results;
      }
      if (!password) {
        results.code = STATUS_CODE.PRECONDITION_FAILED;
        results.message = 'password is missing';
        return results;
      }

      /** get user infomation */
      const user = await MYSQL.userService.findOne({
        attributes: ['id', 'username', 'password', 'authToken'],
        where: { username: username },
        include: [
          {
            model: UserRoleModel,
            as: 'userRole',
            attributes: ['id', 'role'],
          },
        ],
      });

      if (!user) {
        results.code = STATUS_CODE.PRECONDITION_FAILED;
        results.message = 'user not found';
        return results;
      }

      /** check password */
      const isCorrect = this.comparePassword(password, user.password);

      if (isCorrect) {
        /** update some information */
        const token = this.getToken(user);
        user['authToken'] = token;
        await user.save();

        /** return responses */
        results.code = STATUS_CODE.OK;
        results.message = 'login successfully';
        results.data = { token };
        return results;
      } else {
        results.code = STATUS_CODE.PRECONDITION_FAILED;
        results.message = 'password incorrect';
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
  public getVerify = async (token?: string | null) => {
    const results = {
      code: 0,
      message: '',
      data: null,
    } as HTTPdata;

    try {
      /** check token existed or not */
      if (!token) {
        results.code = STATUS_CODE.UNAUTHORIZED;
        results.message = 'token is missing';
        return results;
      }

      /** decode token to get user data */
      const decodedToken: any = jsonwebtoken.decode(token, { complete: true });
      const userInfo: UserInfo | null | undefined = decodedToken?.payload;

      if (!userInfo) {
        results.code = STATUS_CODE.UNAUTHORIZED;
        results.message = 'invalid token';
        return results;
      }

      /* check token TTL */
      const TTL = Math.round(new Date().getTime() / 1000);
      if (parseInt(decodedToken.payload.exp) < TTL) {
        results.code = STATUS_CODE.UNAUTHORIZED;
        results.message = 'token expired';
        return results;
      }

      /* get user data */
      const userData = await MYSQL.userService.findOne({
        attributes: ['username', 'authToken'],
        where: { username: userInfo.username },
      });

      if (!userData) {
        results.code = STATUS_CODE.UNAUTHORIZED;
        results.message = 'userData in DB not found';
        return results;
      }

      /* verify token */
      if (userData.authToken === token) {
        results.code = STATUS_CODE.OK;
        results.message = 'valid token';
        results.data = userInfo;
        return results;
      } else {
        results.code = STATUS_CODE.UNAUTHORIZED;
        results.message = 'invalid token';
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
  public authorizedUserRole = async (authorizedRole: string, role?: string | null) => {
    const results = {
      code: 0,
      message: '',
      data: null,
    } as HTTPdata;

    try {
      /** check inputs */
      if (!role) {
        results.code = STATUS_CODE.PRECONDITION_FAILED;
        results.message = 'missing role in token';
        return results;
      }

      /** call query to get record */
      const userRole = await MYSQL.userRoleService.findOne({
        where: { role: role },
      });

      if (!userRole) {
        results.code = STATUS_CODE.PRECONDITION_FAILED;
        results.message = 'invalid role in token';
        return results;
      }

      /** check if role in token is authorized or not */
      if (userRole.role === authorizedRole) {
        results.code = STATUS_CODE.OK;
        results.message = 'authorized role';
        return results;
      } else {
        results.code = STATUS_CODE.EXPECTATION_FAILED;
        results.message = 'unauthorized role';
        return results;
      }
    } catch (err) {
      results.code = STATUS_CODE.INTERNAL_SERVER_ERROR;
      results.message = err.toString();
      results.data = err;
      return results;
    }
  };
}

const authController = new AuthController();

export default authController;
