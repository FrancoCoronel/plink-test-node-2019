const bcrypt = require('bcrypt'),
  jwt = require('jwt-simple'),
  errors = require('../errors'),
  logger = require('../logger'),
  moment = require('moment'),
  constants = require('../constants'),
  config = require('./../../config'),
  userService = require('../services/users');

const SECRET = config.common.session.secret;

const expirationDate = () => moment().add(constants.EXPIRATION_DAYS, 'days');

exports.HEADER_NAME = config.common.session.header_name;

exports.encode = toEncode => jwt.encode(toEncode, SECRET);

exports.decode = toDecode => jwt.decode(toDecode, SECRET);

exports.generateAccessToken = async user => {
  const newExpirationDate = expirationDate();
  logger.info('Trying to generate an access token');
  try {
    return {
      token: await exports.encode({
        exp: newExpirationDate,
        id: user.id,
        iss: 'JWT'
      }),
      exp: newExpirationDate
    };
  } catch (err) {
    logger.error(`Error while trying to generate an access token: ${err}`);
    throw err;
  }
};

exports.login = async user => {
  try {
    const foundedUser = await userService.getUserByUsername(user.username);
    if (!foundedUser) {
      throw errors.credentialsError(`Invalid username: ${user.username}`);
    }
    const validatePassword = await bcrypt.compare(user.password, foundedUser.password);
    if (!validatePassword) {
      throw errors.credentialsError('Invalid password');
    }
    return foundedUser;
  } catch (err) {
    throw err;
  }
};
