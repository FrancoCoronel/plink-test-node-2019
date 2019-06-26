const axios = require('axios'),
  constants = require('../constants'),
  errors = require('../errors'),
  logger = require('../logger');

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
