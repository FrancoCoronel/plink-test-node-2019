const constants = require('../constants'),
  errors = require('../errors'),
  logger = require('../logger'),
  cryptoCoinSerializer = require('../serializers/cryptoCoin'),
  cryptoCoinService = require('../services/cryptoCoin');

exports.coinsOfUser = async (req, res, next) => {
  const authenticatedUserId = req.user.id;
  const userId = req.params.id;
  const { preferenceMoney } = req.user;
  logger.info(`User ${req.user.id} is trying to list coins`);

  try {
    if (authenticatedUserId !== userId) {
      throw errors.forbiddenError('User is not allowed to list coins of another user');
    }
    const coinsOfUser = await cryptoCoinService.getCoinsOfUser(userId);
    const coinIds = coinsOfUser.map(coin => coin.coin);
    const currentlyICoinsInfo = await cryptoCoinService.getCurrentlyCoinsInfo(coinIds, preferenceMoney);
    res.status(200).send(cryptoCoinSerializer.coinsInfo(currentlyICoinsInfo));
  } catch (err) {
    next(err);
  }
};

exports.getTop3CoinsOfUser = async (req, res, next) => {
  const authenticatedUserId = req.user.id;
  const userId = req.params.id;
  const { preferenceMoney } = req.user;
  const order = req.query.order ? req.query.order.toLowerCase() : constants.DEFAULT_ORDER;
  logger.info(`User ${req.user.id} is trying to list the top 3 coins`);
  try {
    if (authenticatedUserId !== userId) {
      throw errors.forbiddenError('User is not allowed to list coins of another user');
    }
    const coinsOfUser = await cryptoCoinService.getCoinsOfUser(userId);
    const coinIds = coinsOfUser.map(coin => coin.coin);
    const currentlyICoinsInfo = await cryptoCoinService.getTop3CoinsInfo(coinIds, preferenceMoney, order);
    res.status(200).send(cryptoCoinSerializer.coinsInfo(currentlyICoinsInfo));
  } catch (err) {
    next(err);
  }
};
