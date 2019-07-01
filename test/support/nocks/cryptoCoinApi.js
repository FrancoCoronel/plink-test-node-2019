/* eslint-disable new-cap */
const nock = require('nock'),
  config = require('../../../config'),
  cryptoCoinMock = require('../mocks/cryptoCoin');

const GET_COIN_DETAILS = coin => `/ticker?show=${coin}&coin=btc`;
const GET_COIN_INFO_CONVERT = (fromCoin, preferenceMoney) =>
  `/convert?qty=1&from=${fromCoin}&to=${preferenceMoney}`;
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
    },
    getCoinsInfo: {
      okResponse: (preferenceMoney, coinIds) =>
        coinIds.map(coin =>
          nock(CRYPTO_COIN_API_URL)
            .get(GET_COIN_INFO_CONVERT(coin, preferenceMoney))
            .reply(200, cryptoCoinMock.currentlyCoinInfo(coin))
        )
    }
  }
};
