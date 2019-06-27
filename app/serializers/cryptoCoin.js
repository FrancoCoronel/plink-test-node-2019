exports.coinsInfo = coinsInfo =>
  coinsInfo.map(coin => ({
    price: coin.to_quantity,
    name: coin.from_name,
    source: coin.source
  }));

exports.addedCoinForUser = coin => ({
  user_id: coin.userId,
  coin: coin.coin
});
