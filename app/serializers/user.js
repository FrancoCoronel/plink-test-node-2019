exports.user = user => ({
  id: user.id,
  username: user.username,
  first_name: user.firstName,
  last_name: user.lastName,
  preference_money: user.preferenceMoney
});
