exports.create = user => ({
  username: user.username,
  password: user.password,
  firstName: user.first_name,
  lastName: user.last_name,
  preferenceMoney: user.preference_money
});
