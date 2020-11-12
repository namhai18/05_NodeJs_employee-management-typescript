import { assert } from 'chai';
import generalController from './genaral.controllers';

describe('general APIs', () => {
  describe('get members in tree model', () => {
    describe('happy cases', () => {
      it('get data successfully', async () => {
        const results = await generalController.getMembersInTreeModel();
        assert.equal(results.message, 'successfully');
      });
    });
  });
  describe('get limit 1500 members', () => {
    describe('happy cases', () => {
      it('get data successfully', async () => {
        const results = await generalController.getLimit1500Members();
        assert.equal(results.message, 'successfully');
      });
      it('get data successfully with limit 1500 members', async () => {
        const results = await generalController.getLimit1500Members();
        assert.equal(results.data.memberNumber, 1500);
      });
    });
  });
});
