const errors = require('../errors'),
  logger = require('../logger'),
  userService = require('../services/users'),
  userMapper = require('../mappers/users'),
  userSerializer = require('../serializers/user'),
  cryptoCoinSerializer = require('../serializers/cryptoCoin'),
  sessionManager = require('../services/sessionManager');

exports.create = async (req, res, next) => {
  const user = userMapper.create(req.body);
  try {
    const createdUser = await userService.create(user);
    res.status(201).send(userSerializer.user(createdUser));
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const user = req.body;
  try {
    const foundedUser = await sessionManager.login(user);
    const accessToken = await sessionManager.generateAccessToken(foundedUser);
    res.status(200).send(accessToken);
  } catch (err) {
    next(err);
  }
};

exports.addCoinForUser = async (req, res, next) => {
  const authenticatedUserId = req.user.id;
  const userId = req.params.id;
  const { coin } = req.body;
  logger.info(`User ${req.user.id} is trying to add coin ${coin}`);

  try {
    if (authenticatedUserId !== userId) {
      throw errors.forbiddenError('User is not allowed to add a coin to another user');
    }
    const createdCoin = await userService.createCoin(userId, coin);
    res.status(201).send(cryptoCoinSerializer.addedCoinForUser(createdCoin));
  } catch (err) {
    next(err);
  }
};
