const constants = require('../constants');

module.exports = {
  paramValidations: {
    USERNAME: { code: 'WP001', message: 'Username must be alphanumeric and has between 1 and 8 caracters' },
    FIRST_NAME: {
      code: 'WP002',
      message: 'first_name is mandatory and must be string'
    },
    LAST_NAME: { code: 'WP003', message: 'last_name is mandatory and must be string' },
    PASSWORD: { code: 'WP004', message: 'password is mandatory and must be string' },
    PREFERENCE_MONEY: {
      code: 'WP005',
      message: `preference_money is mandatory and must be string 
      with one of these permitted values: ${constants.PREFERENCE_MONEY}`
    },
    COIN: {
      code: 'WP006',
      message: `coin is mandatory and must be string 
      with one of these permitted values: ${constants.PREFERENCE_MONEY}`
    },
    ID: {
      code: 'WP007',
      message: 'id is mandatory and must be an integer'
    }
  }
};
