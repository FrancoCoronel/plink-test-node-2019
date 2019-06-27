const config = require('./../../config');

exports.EXPIRATION_DAYS = parseInt(config.common.session.expirationDays);
exports.SALT_ROUNDS = parseInt(config.common.bcrypt.saltRounds);
exports.AUTHORIZATION_HEADER_NAME = config.common.session.header_name;
exports.PREFERENCE_MONEY = ['USD', 'EUR', 'COP'];
exports.COIN_API_URL = config.common.coinAPI.url;
exports.X_RAPID_API_KEY = config.common.coinAPI.xRapidApiKey;
exports.ORDER = ['asc', 'desc'];
exports.DEFAULT_ORDER = 'desc';
