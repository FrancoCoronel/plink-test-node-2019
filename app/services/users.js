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

const getUserByUsername = async username => {
  logger.info(`Trying to find user with username: ${username}`);
  const query = {
    attributes: ['id', 'username', 'password'],
    where: {
      username: { $like: `%${username}%` }
    }
  };
  try {
    return await User.findOne(query);
  } catch (err) {
    logger.error(`Error while trying to find user with username: ${username}`);
    throw errors.databaseError(err.message);
  }
};

exports.getById = async id => {
  try {
    const foundedUser = await User.findByPk(id);
    if (!foundedUser) {
      throw errors.notFound(`User with id ${id} not found`);
    }
    return foundedUser;
  } catch (err) {
    logger.error(`Error while trying to get user with id: ${id}`);
    throw errors.databaseError(err.message);
  }
};

exports.create = create;
exports.getUserByUsername = getUserByUsername;
