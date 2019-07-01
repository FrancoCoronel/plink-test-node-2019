const bcrypt = require('bcrypt'),
  { factory } = require('factory-girl'),
  constants = require('../../app/constants'),
  models = require('../../app/models'),
  User = models.user,
  userMock = require('../support/mocks/user');

const userFactoryId = 'user';

factory.define(userFactoryId, User, {
  username: userMock.genericUser.username,
  firstName: userMock.genericUser.firstName,
  lastName: userMock.genericUser.lastName,
  preferenceMoney: userMock.genericUser.preferenceMoney
});

const newUser = async ({
  username,
  password = userMock.genericUser.password,
  firstName,
  lastName,
  preferenceMoney
}) => {
  const attrs = {};
  if (password) {
    attrs.password = await bcrypt.hash(password, constants.SALT_ROUNDS);
  }
  if (firstName) {
    attrs.firstName = firstName;
  }
  if (username) {
    attrs.username = username;
  }
  if (lastName) {
    attrs.lastName = lastName;
  }
  if (preferenceMoney) {
    attrs.preferenceMoney = preferenceMoney;
  }
  return factory.create(userFactoryId, attrs);
};

exports.newUser = newUser;
