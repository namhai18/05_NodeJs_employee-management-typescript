import express, { Router } from 'express';
import STATUS_CODE from 'http-status';
import errorHandler from '../../../configs/errorHandler/errorHandler';
import authController from './auth.controllers';
import jsonwebtoken from 'jsonwebtoken';
import { UserInfo } from '../../../configs/interfaces';

const authRouter = Router();

authRouter.post('/login', login());

/** ================================================================================== */
/**
functions
*/

function login(endHere = true) {
  return errorHandler(
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const username = req.body.username as string;
      const password = req.body.password as string;

      const results = await authController.login(username, password);

      if (endHere) {
        res.status(results.code).send(results);
        if (results.code !== STATUS_CODE.OK) throw results.message;
      } else {
        if (results.code === STATUS_CODE.OK) {
          next();
        } else {
          res.status(results.code).send(results);
          throw results.message;
        }
      }
    },
  );
}

export function verifyToken() {
  return errorHandler(
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const token = req.headers.token as string;

      const results = await authController.getVerify(token);

      if (results.code === STATUS_CODE.OK) {
        next();
      } else {
        res.status(results.code).send(results);
        throw results.message;
      }
    },
  );
}

export function authorizedUserRole(authorizedRole: string) {
  return errorHandler(
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const token = req.headers.token as string;
      const userInfo = jsonwebtoken.decode(token) as UserInfo;
      const role = userInfo.role;

      const results = await authController.authorizedUserRole(authorizedRole, role);

      if (results.code === STATUS_CODE.OK) {
        next();
      } else {
        res.status(results.code).send(results);
        throw results.message;
      }
    },
  );
}

export default authRouter;
