import { assert } from 'chai';
import authController from './auth.controllers';

describe('authentication APIs', () => {
  describe('verify token', () => {
    describe('happy cases', () => {
      it('case token is valid', async () => {
        const token =
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsImlhdCI6MTYwMjY4NDY4OCwiZXhwIjoxNjAyNzI3ODg4fQ.QqF3R6-YvF6VtolVyZRObQBb33589VRLonftBxt000s';
        const results = await authController.getVerify(token);
        assert.equal(results.message, 'valid token');
      });
    });
    describe('unhappy cases', () => {
      it('case token is missing (null)', async () => {
        const token = null;
        const results = await authController.getVerify(token);
        assert.equal(results.message, 'token is missing');
      });
      it('case token is missing (undefined)', async () => {
        const token = undefined;
        const results = await authController.getVerify(token);
        assert.equal(results.message, 'token is missing');
      });
      it('case token expired', async () => {
        const token =
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsImlhdCI6MTYwMjYwNzEyOCwiZXhwIjoxNjAyNjUwMzI4fQ.dR3yedcH0JPudpAGUfYWIeS6iN2KnocL9ZImhA9IMG0';
        const results = await authController.getVerify(token);
        assert.equal(results.message, 'token expired');
      });
      it('case invalid token (when input)', async () => {
        const token = 'adasd35852rdsfsdfd';
        const results = await authController.getVerify(token);
        assert.equal(results.message, 'invalid token');
      });
      it('case token expired (when compared which stored token)', async () => {
        const token =
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsImlhdCI6MTYwMjY4MjkxMywiZXhwIjoxNjAyNzI2MTEzfQ.VHLfRICYP4uCPdh2XHwLBD22FUDFPkSU8PDx8QBZIy4';
        const results = await authController.getVerify(token);
        assert.equal(results.message, 'invalid token');
      });
    });
  });

  describe('login', () => {
    describe('unhappy cases', () => {
      it('case username is missing (null)', async () => {
        const username = null;
        const password = 'admin';
        const results = await authController.login(username, password);
        assert.equal(results.message, 'username is missing');
      });
      it('case username is missing (undefined)', async () => {
        const username = undefined;
        const password = 'admin';
        const results = await authController.login(username, password);
        assert.equal(results.message, 'username is missing');
      });
      it('case password is missing (null)', async () => {
        const username = 'admin';
        const password = null;
        const results = await authController.login(username, password);
        assert.equal(results.message, 'password is missing');
      });
      it('case password is missing (undefined)', async () => {
        const username = 'admin';
        const password = undefined;
        const results = await authController.login(username, password);
        assert.equal(results.message, 'password is missing');
      });
      it('case user not found', async () => {
        const username = 'abcd';
        const password = 'admin';
        const results = await authController.login(username, password);
        assert.equal(results.message, 'user not found');
      });
      it('case password incorrect', async () => {
        const username = 'admin';
        const password = 'abcd';
        const results = await authController.login(username, password);
        assert.equal(results.message, 'password incorrect');
      });
    });
  });
});
