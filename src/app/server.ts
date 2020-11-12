import debug from 'debug';
import http from 'http';
import https from 'https';
import ENV from '../configs/env';
import sequelize from '../configs/sequelize';
import MYSQL from '../main/database/mysql/mysqlService';
import { createDumpData } from './dumpData';
import app from './express';
import fs from 'fs';
import path from 'path';

const logger = debug('employee-management:server');

const ssl = {
  key: fs.readFileSync(path.resolve('SSL/test-ssl.local.key')),
  cert: fs.readFileSync(path.resolve('SSL/test-ssl.local.crt')),
};

const HTTP = http.createServer(app);
const HTTPS = https.createServer(ssl, app);

/**
 * connect to Databases
 * */
sequelize
  .authenticate()
  .then(() => logger(`Connected to database: ${ENV.APP_DB_URL}`))
  .catch((err: Error) => console.error(`Unable to connect to the database: ${err.toString()}`));

sequelize
  .sync({ alter: false, force: false })
  .then(() => {
    console.log(`initialize table: ${MYSQL.ceoService.generateTable()}`);
    console.log(`initialize table: ${MYSQL.departmentService.generateTable()}`);
    console.log(`initialize table: ${MYSQL.teamService.generateTable()}`);
    console.log(`initialize table: ${MYSQL.memberService.generateTable()}`);
    console.log(`initialize table: ${MYSQL.teamMemberService.generateTable()}`);
    console.log(`initialize table: ${MYSQL.userService.generateTable()}`);
    console.log(`initialize table: ${MYSQL.userRoleService.generateTable()}`);
  })
  .then(async () => createDumpData())
  .catch((err: Error) => console.error(`Unable to sync with the database: ${err.toString()}`));

/**
 * enable server to listen to HTTP requests
 * */
HTTP.listen(ENV.HTTP_PORT, () => logger(`HTTP : Listening on ${ENV.HTTP_PORT}`));

/**
 * enable server to listen to HTTPS requests
 * */
HTTPS.listen(ENV.HTTPS_PORT, () => logger(`HTTPS : Listening on ${ENV.HTTPS_PORT}`));
