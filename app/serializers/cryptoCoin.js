exports.coinsInfo = coinsInfo =>
  coinsInfo.map(coin => ({
    price: coin.to_quantity,
    name: coin.from_name,
    source: coin.source,
    coin_id: coin.from_symbol
  }));

exports.addedCoinForUser = coin => ({
  user_id: coin.userId,
  coin: coin.coin
});
