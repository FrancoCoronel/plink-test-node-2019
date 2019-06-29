/* eslint-disable new-cap */
const chance = require('chance').Chance(),
  arrays = require('../arrays'),
  constants = require('../../../app/constants');

const numbers = '0123456789';
const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVW';

const alphanumeric = `${letters}${numbers}`;

exports.accessToken = {
  token: chance.string(),
  exp: '2019-06-27T23:50:38.239Z'
};

exports.genericUser = {
  id: chance.integer({ min: 1, max: constants.MAX_INT_VALUE_DB }),
  username: chance.string({ pool: alphanumeric }),
  password: chance.string({ pool: alphanumeric, length: 10 }),
  firstName: chance.string({ pool: letters }),
  lastName: chance.string({ pool: letters }),
  preferenceMoney: arrays.sampleFromArray(constants.PREFERENCE_MONEY)
};
