const errors = require('../errors'),
  logger = require('../logger'),
  cryptoCoinService = require('../services/cryptoCoin');

exports.coinsOfUser = async (req, res, next) => {
  const authenticatedUserId = parseInt(req.user.id);
  const userId = parseInt(req.params.id);
  const { preferenceMoney } = req.user;
  logger.info(`User ${req.user.id} is trying to list coins`);

  try {
    if (authenticatedUserId !== userId) {
      throw errors.forbiddenError('User is not allowed to list coins of another user');
    }
    const coinsOfUser = await cryptoCoinService.getCoinsOfUser(userId);
    const coinIds = coinsOfUser.map(coin => coin.coin);
    const currentlyICoinsInfo = await cryptoCoinService.getCurrentlyCoinsInfo(coinIds, preferenceMoney);
    res.status(201).send(currentlyICoinsInfo);
  } catch (err) {
    next(err);
  }
};
