/* eslint-disable new-cap */
const chance = require('chance').Chance();

exports.coinInfo = {
  source: 'BraveNewCoin',
  coin_id: 'LTC',
  success: true,
  currency: 'USD',
  utc_date: '2018-09-10 01:06:01',
  coin_name: 'Litecoin',
  last_price: '55.04515558',
  time_stamp: '1536541561',
  volume_24hr: '282621007',
  currency_name: 'United States Dollar',
  vol_24hr_pcnt: '9.17',
  price_24hr_pcnt: '4.05'
};

exports.addedCoinForUser = userId => ({
  userId,
  coin: exports.coinInfo.coin_id
});

exports.coinsOfUser = userId =>
  Array.from({ length: chance.integer({ min: 5, max: 10 }) }, () => ({
    userId,
    coin: chance.string()
  }));

exports.currentlyCoinsInfo = coins =>
  coins.map(coin => ({
    to_quantity: chance.floating({ min: 1, max: 100 }),
    from_name: coin,
    source: chance.string()
  }));
