const constants = require('../constants'),
  paramErrors = require('./../constants/errorsCatalog').paramValidations;

exports.login = {
  username: {
    in: 'body',
    errorMessage: paramErrors.USERNAME,
    exists: true,
    isString: true
  },
  password: {
    in: 'body',
    errorMessage: paramErrors.PASSWORD,
    exists: true,
    isString: true
  }
};

exports.create = {
  first_name: {
    in: 'body',
    errorMessage: paramErrors.FIRST_NAME,
    exists: true,
    isString: true
  },
  last_name: {
    in: 'body',
    errorMessage: paramErrors.LAST_NAME,
    exists: true,
    isString: true
  },
  username: {
    in: 'body',
    errorMessage: paramErrors.USERNAME,
    exists: true,
    isString: true,
    isLength: {
      options: { min: 4, max: 20 }
    }
  },
  password: {
    in: 'body',
    errorMessage: paramErrors.PASSWORD,
    exists: true,
    isString: true,
    isAlphanumeric: true,
    isLength: {
      options: { min: 8, max: 20 }
    }
  },
  preference_money: {
    in: 'body',
    errorMessage: paramErrors.PREFERENCE_MONEY,
    exists: true,
    isString: true,
    custom: {
      options: preferenceMoney => constants.PREFERENCE_MONEY.includes(preferenceMoney.toUpperCase())
    }
  }
};

exports.addCoinForUser = {
  coin: {
    in: 'body',
    errorMessage: paramErrors.COIN,
    exists: true,
    isString: true
  },
  id: {
    in: ['params'],
    errorMessage: paramErrors.ID,
    isInt: true,
    toInt: true,
    exists: true
  }
};

exports.checkId = {
  id: {
    in: ['params'],
    errorMessage: paramErrors.ID,
    isInt: true,
    toInt: true,
    exists: true
  }
};

exports.top3 = {
  id: {
    in: ['params'],
    errorMessage: paramErrors.ID,
    isInt: true,
    toInt: true,
    exists: true
  },
  order: {
    in: ['query'],
    errorMessage: paramErrors.ORDER,
    optional: true,
    isString: true,
    custom: {
      options: order => constants.ORDER.includes(order.toLowerCase())
    }
  }
};
