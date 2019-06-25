const config = require('./../../config');

exports.EXPIRATION_DAYS = parseInt(config.common.session.expirationDays);
exports.SALT_ROUNDS = parseInt(config.common.bcrypt.saltRounds);
