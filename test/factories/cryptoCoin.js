const { factory } = require('factory-girl'),
  models = require('../../app/models'),
  CryptoCoin = models.crypto_coin;

const cryptoCoinFactoryId = 'cryptoCoin';

factory.define(cryptoCoinFactoryId, CryptoCoin, {});

const newCoin = (userId, coin) => factory.create(cryptoCoinFactoryId, { userId, coin });

const newCoins = coins => factory.createMany(cryptoCoinFactoryId, coins);

exports.newCoin = newCoin;
exports.newCoins = newCoins;
