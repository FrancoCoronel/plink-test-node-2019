/* eslint-disable new-cap */

const chance = require('chance').Chance(),
  constants = require('../../app/constants');

exports.getRandomInteger = (min, max) => chance.integer({ min, max });

exports.getRandomDatabaseInt = () => exports.getRandomInteger(1, constants.MAX_INT_VALUE_DB);
