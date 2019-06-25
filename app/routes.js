const { healthCheck } = require('./controllers/healthCheck'),
  userController = require('./controllers/users'),
  paramsValidator = require('./middlewares/paramsValidator'),
  schemas = require('./schemas'),
  userFetcher = require('./middlewares/userFetcher'),
  cors = require('cors');

exports.init = app => {
  app.use(cors());
  app.get('/health', healthCheck);
  app.post(
    '/users/sessions',
    [paramsValidator.validateSchemaAndFail(schemas.users.login)],
    userController.login
  );
  app.post(
    '/users',
    [paramsValidator.validateSchemaAndFail(schemas.users.create), userFetcher.fetch],
    userController.create
  );
};
