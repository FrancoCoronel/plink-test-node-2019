const coinService = require('../services/cryptoCoin'),
  logger = require('../logger');

const getCoinInformation = coin => coinService.checkCoin(coin);

exports.fetch = async (req, res, next) => {
  const coin = req.body.coin || req.body.preference_money;

  try {
    await getCoinInformation(coin);
    return next();
  } catch (err) {
    logger.info(`Error in coinFecther: ${err}`);
    return next(err);
  }
};
