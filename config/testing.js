exports.config = {
  environment: 'testing',
  isTesting: true,
  common: {
    database: {
      name: process.env.DB_NAME_TEST
    },
    session: {
      header_name: 'authorization',
      secret: 'some-super-secret',
      expirationDays: process.env.EXPIRATION_DAYS
    },
    coinAPI: {
      url: 'http://coin.api.example.org',
      xRapidApiKey: process.env.X_RAPID_API_KEY
    },
    bcrypt: {
      saltRounds: process.env.SALT_ROUNDS
    }
  }
};
