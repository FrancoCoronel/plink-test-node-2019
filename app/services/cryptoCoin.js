const axios = require('axios'),
  CryptoCoin = require('../models').crypto_coin,
  constants = require('../constants'),
  errors = require('../errors'),
  logger = require('../logger'),
  cryptoCoinSerializer = require('../serializers/cryptoCoin');

const URL = constants.COIN_API_URL;
const token = constants.X_RAPID_API_KEY;

exports.checkCoin = async coin => {
  const url = `${URL}/ticker?show=${coin}&coin=btc`;
  logger.info(`Making a request to url ${url}`);
  try {
    const response = await axios.get(`${url}`, {
      headers: { 'X-RapidAPI-Key': token }
    });
    if (!response.data.success) {
      throw errors.coinApiError(response.data);
    }
    return response.data;
  } catch (err) {
    logger.error(`Error while trying to get ticker coin ${coin}`);
    throw err;
  }
};

exports.getCoinsOfUser = async userId => {
  logger.info(`Tryng to get coins of user with id ${userId}`);
  try {
    const foundedCoinsOfUser = await CryptoCoin.findAll({
      where: { userId }
    });
    return foundedCoinsOfUser;
  } catch (err) {
    logger.error(`Error while trying to get coins of user with id ${userId}`);
    throw err;
  }
};

exports.getCurrentlyCoinsInfo = async (coinIds, preferenceMoney) => {
  const coinsInfo = [];
  try {
    await Promise.all(
      coinIds.map(async fromCoin => {
        const url = `${URL}/convert?qty=1&from=${fromCoin}&to=${preferenceMoney}`;
        logger.info(`Trying to get coin ${fromCoin} info from ${url}`);
        const response = await axios.get(`${url}`, {
          headers: { 'X-RapidAPI-Key': token }
        });
        coinsInfo.push(response.data);
      })
    );
    return cryptoCoinSerializer.coinsInfo(coinsInfo);
  } catch (err) {
    logger.error(`Error while trying to get coins info of ${coinIds}`);
    throw err;
  }
};
