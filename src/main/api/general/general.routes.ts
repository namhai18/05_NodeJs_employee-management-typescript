import express, { Router } from 'express';
import STATUS_CODE from 'http-status';
import errorHandler from '../../../configs/errorHandler/errorHandler';
import generalController from './genaral.controllers';

const genaralRouter = Router();

genaralRouter.get('/getMembersInTreeModel', getMembersInTreeModel());
genaralRouter.get('/getLimit1500Members', getLimit1500Members());

/** ================================================================================== */
/**
functions
*/

function getMembersInTreeModel(endHere = true) {
  return errorHandler(
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const results = await generalController.getMembersInTreeModel();

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

function getLimit1500Members(endHere = true) {
  return errorHandler(
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const results = await generalController.getLimit1500Members();

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

export default genaralRouter;
