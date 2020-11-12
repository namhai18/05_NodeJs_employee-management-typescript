import compression from 'compression';
import cookieParser from 'cookie-parser';
import express from 'express';
import fs from 'fs';
import helmet from 'helmet';
import morgan from 'morgan';
import os from 'os';
import path, { join } from 'path';
import { UserRole } from '../configs/enum-list';
import ENV from '../configs/env';
import { getFilesizeInBytes } from '../configs/utils';
import authRouter, { authorizedUserRole, verifyToken } from '../main/api/auth/auth.routes';
import commonRouter from '../main/api/common/common.routes';
import genaralRouter from '../main/api/general/general.routes';
import cors from 'cors';

let num = 0;

const app = express();

loadConfigs();
loadRoutes();
loadViews();

export default app;

/** ================================================================================== */
/**
functions
*/

function loadConfigs() {
  /* check file size */
  let fileSize = getFilesizeInBytes(join(__dirname, `/access${num}.log`));
  while (fileSize > ENV.ACCESS_LOG_FILE_MAX_SIZE) {
    num++;
    fileSize = getFilesizeInBytes(join(__dirname, `/access${num}.log`));
  }

  const accessLogStream = fs.createWriteStream(path.join(__dirname, `/access${num}.log`), {
    flags: 'a',
  });

  /** HTTP request logger */
  app.use(
    morgan(
      `=================== ${ENV.NODE_ENV === 'production' ? 'common' : 'dev'} ==================` +
        os.EOL +
        'remote-addr: :remote-addr' +
        os.EOL +
        'remote-user: :remote-user' +
        os.EOL +
        'date: [:date[clf]]' +
        os.EOL +
        'method: ":method :url HTTP/:http-version"' +
        os.EOL +
        'status: :status :res[content-length]' +
        os.EOL +
        'referrer: ":referrer"' +
        os.EOL +
        'user-agent: ":user-agent"' +
        os.EOL +
        'req[query]: :req[query]' +
        os.EOL +
        'req[body]: :req[body]',
      {
        stream: accessLogStream,
      },
    ),
  );

  /** secure app by setting various HTTP headers */
  app.use(helmet());

  /** enable cross-origin resource sharing (CORS)  */
  app.use(cors());

  /** for parsing cookies */
  app.use(cookieParser());

  /** for parsing HTTP request type : application/json */
  app.use(express.json());

  /** for parsing HTTP request type :  application/x-www-form-urlencoded */
  app.use(express.urlencoded({ extended: true }));

  /** compress HTTP responses */
  app.use(compression());
}

function loadRoutes() {
  app.use('/auth', authRouter);
  app.use('/general', verifyToken(), genaralRouter);
  app.use('/common', verifyToken(), authorizedUserRole(UserRole.admin), commonRouter);
}

function loadViews() {
  app.use(express.static(join(__dirname, '../../build')));
  app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '../../build', 'index.html'));
  });
}
