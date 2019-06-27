/* eslint-disable new-cap */
const chance = require('chance').Chance(),
  arrays = require('../arrays'),
  constants = require('../../../app/constants');

exports.accessToken = {
  token: chance.string(),
  exp: '2019-06-27T23:50:38.239Z'
};

exports.genericUser = {
  id: chance.integer({ min: 1, max: constants.MAX_INT_VALUE_DB }),
  username: 'userPlink',
  password: 'pruebas1234',
  firstName: 'Plink',
  lastName: 'Plink',
  preferenceMoney: 'USD'
};

exports.userInfo = {
  id: chance.integer({ min: 1, max: constants.MAX_INT_VALUE_DB }),
  username: chance.string({ length: 5 }),
  password: chance.string(),
  firstName: chance.string(),
  lastName: chance.string(),
  preferenceMoney: arrays.sampleFromArray(constants.PREFERENCE_MONEY)
};
