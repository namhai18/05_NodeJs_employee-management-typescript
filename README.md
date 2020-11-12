# employee-management

Description: Back-end system demo

Design pattern: Typescript

Framework: expressjs

API: Restful API

authentication session: JWT

hash login password: cryptojs

Database: MySQL

ORM: Sequelize

Unit test tool: mocha, chai, nyc

Unit test report: mochawesome, lcov

API test: Postman

============================================================================
start project

- \$ npm run start:dev

============================================================================
APIs are store in Postman-APIs folder for testing.

1./ login with API http://localhost:3000/auth/login
to get JWT

2./ call API http://localhost:3000/common/createDumpData
with JWT in the headers to create dump data (no JWT => unauthorized)

3./ call API http://localhost:3000/general/getMembersInTreeModel
with JWT in the headers to get data in tree model from ceo to members (no JWT => unauthorized)

4./ call API http://localhost:3000/general/getLimit1500Members
with JWT in the headers to get data with limit 1500 members (no JWT => unauthorized)

============================================================================
unit tests

- \$ npm run test

  => html report will be generated in folder test-reports

============================================================================
coverage tests

- \$ npm run coverage

  => html report will be generated in folder test-reports
