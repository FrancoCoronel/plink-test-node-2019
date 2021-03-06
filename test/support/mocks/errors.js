exports.databaseError = message => ({
  errors: message,
  internal_code: 'database_error',
  origin: 'PlinkApi',
  status_code: 503
});

exports.defaultError = message => ({
  errors: message,
  internal_code: 'default_error',
  origin: 'PlinkApi',
  status_code: 500
});

exports.credentialsError = message => ({
  errors: message,
  internal_code: 'credentials_error',
  origin: 'PlinkApi',
  status_code: 401
});

exports.coinApiError = message => ({
  errors: message,
  internal_code: 'coin_api_error',
  origin: 'coinApiServer',
  status_code: 503
});
