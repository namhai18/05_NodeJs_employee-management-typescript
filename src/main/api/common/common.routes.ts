import express, { Router } from 'express';
import STATUS_CODE from 'http-status';
import errorHandler from '../../../configs/errorHandler/errorHandler';
import { convertStringToNumber } from '../../../configs/utils';
import commonController from './common.controllers';

const commonRouter = Router();

commonRouter.post('/createDumpData', createCEO(false), createMembers(false), createTeamMembers());

/** ================================================================================== */
/**
functions
*/

function createCEO(endHere = true) {
  return errorHandler(
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const numberOfDepartment = req.body.numberOfDepartment as number;
      const numberOfTeamPerDepartment = req.body.numberOfTeamPerDepartment as number;
      const numberOfMember = req.body.numberOfMember as number;

      const results = await commonController.createCEO(
        numberOfDepartment,
        numberOfTeamPerDepartment,
        numberOfMember,
      );

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

function createMembers(endHere = true) {
  return errorHandler(
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const numberOfMember = req.body.numberOfMember as number;

      const results = await commonController.createMembers(numberOfMember);

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

function createTeamMembers(endHere = true) {
  return errorHandler(
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const results = await commonController.createTeamMembers();

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

export default commonRouter;
