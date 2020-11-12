import * as express from 'express';
import fs from 'fs';
import jsonwebtoken from 'jsonwebtoken';
import moment from 'moment-timezone';
import os from 'os';
import { join } from 'path';
import ENV from '../env';
import { UserInfo } from '../interfaces';
import { getFilesizeInBytes } from '../utils';

let num = 0;

const errorHandler = (fn: any) => (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  Promise.resolve()
    .then(() => fn(req, res, next))
    .catch((error: Error) => {
      const token = req.headers.token as string;
      const userInfo = jsonwebtoken.decode(token) as UserInfo;

      console.error('errorHandler: ', error.toString());

      /** get current using moment.js */
      const jaMoment = moment().tz(ENV.MOMENT_TIMEZONE).locale(ENV.MOMENT_LOCALE);
      console.log('jaMoment: ', jaMoment.format('YYYY-MM-DD, h:mm:ss a'));

      /** check file size */
      let fileSize = getFilesizeInBytes(join(__dirname, `/errorLog${num}.txt`));
      while (fileSize > ENV.ERROR_LOG_FILE_MAX_SIZE) {
        num++;
        fileSize = getFilesizeInBytes(join(__dirname, `/errorLog${num}.txt`));
      }

      /** add error to file errorLog.txt */
      fs.appendFile(
        join(__dirname, `/errorLog${num}.txt`),

        '========================================================' +
          os.EOL +
          `date: ${JSON.stringify(jaMoment.format('YYYY-MM-DD, h:mm:ss a'))}` +
          os.EOL +
          `API: ${JSON.stringify(req.baseUrl + req.path)}` +
          os.EOL +
          `error: ${JSON.stringify(error)}` +
          os.EOL +
          `username: ${JSON.stringify(userInfo?.username)}` +
          os.EOL +
          `query: ${JSON.stringify(req.query)}` +
          os.EOL +
          `body: ${JSON.stringify(req.body)}` +
          os.EOL,

        (err) => {
          if (err) throw err;
        },
      );
    });
};

export default errorHandler;
