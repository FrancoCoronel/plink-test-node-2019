const { factory } = require('factory-girl'),
  models = require('../../app/models'),
  CryptoCoin = models.crypto_coin;

const cryptoCoinFactoryId = 'cryptoCoin';

factory.define(cryptoCoinFactoryId, CryptoCoin, {});

const newCoin = (userId, coin) => factory.create(cryptoCoinFactoryId, { userId, coin });

exports.newCoin = newCoin;
