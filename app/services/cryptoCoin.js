const _ = require('lodash'),
  axios = require('axios'),
  CryptoCoin = require('../models').crypto_coin,
  constants = require('../constants'),
  errors = require('../errors'),
  logger = require('../logger'),
  cryptoCoinSerializer = require('../serializers/cryptoCoin');

const URL = constants.COIN_API_URL;
const token = constants.X_RAPID_API_KEY;
const TOP3 = 3;

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

const getCoinsInfo = async (coinIds, preferenceMoney) => {
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
    return coinsInfo;
  } catch (err) {
    throw errors.coinApiError(err);
  }
};

exports.getCurrentlyCoinsInfo = async (coinIds, preferenceMoney) => {
  try {
    const coinsInfo = await getCoinsInfo(coinIds, preferenceMoney);
    return cryptoCoinSerializer.coinsInfo(coinsInfo);
  } catch (err) {
    logger.error(`Error while trying to get coins info of ${coinIds}`);
    throw err;
  }
};

exports.getTop3CoinsInfo = async (coinIds, preferenceMoney, order) => {
  const coindIdsWithoutPreferenceMoney = _.without(coinIds, preferenceMoney);
  try {
    const coinsInfo = await getCoinsInfo(coindIdsWithoutPreferenceMoney, preferenceMoney);
    return _.orderBy(cryptoCoinSerializer.coinsInfo(coinsInfo), ['price'], [order]).slice(0, TOP3);
  } catch (err) {
    logger.error('Error while trying to get top 3 coins info');
    throw err;
  }
};
