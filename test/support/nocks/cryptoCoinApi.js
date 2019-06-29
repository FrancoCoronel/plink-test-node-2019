/* eslint-disable new-cap */
const nock = require('nock'),
  config = require('../../../config'),
  cryptoCoinMock = require('../mocks/cryptoCoin');

const GET_COIN_DETAILS = coin => `/ticker?show=${coin}&coin=btc`;
const CRYPTO_COIN_API_URL = config.common.coinAPI.url;

module.exports = {
  cryptoCoins: {
    checkCoin: {
      okResponse: coin =>
        nock(CRYPTO_COIN_API_URL)
          .get(GET_COIN_DETAILS(coin))
          .reply(200, cryptoCoinMock.tickerResponse(coin)),
      notFoundResponse: coin =>
        nock(CRYPTO_COIN_API_URL)
          .get(GET_COIN_DETAILS(coin))
          .reply(200, cryptoCoinMock.notFoundResponse)
    }
  }
};
