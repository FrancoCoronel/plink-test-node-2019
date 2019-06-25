const bcrypt = require('bcrypt'),
  constants = require('../constants'),
  errors = require('../errors'),
  logger = require('../logger'),
  User = require('../models').user;

const create = async user => {
  logger.info(`Trying to create a new user: ${user}`);
  const { password } = user;
  user.password = await bcrypt.hash(password, constants.SALT_ROUNDS);
  try {
    return await User.create(user);
  } catch (err) {
    logger.error(`Error while trying to create a new user: ${err}`);
    throw errors.databaseError(err.message);
  }
};

exports.create = create;
