const { healthCheck } = require('./controllers/healthCheck'),
  userController = require('./controllers/users'),
  paramsValidator = require('./middlewares/paramsValidator'),
  schemas = require('./schemas'),
  cors = require('cors');

exports.init = app => {
  app.use(cors());
  app.get('/health', healthCheck);
  app.post('/users', [paramsValidator.validateSchemaAndFail(schemas.users.create)], userController.create);
};
