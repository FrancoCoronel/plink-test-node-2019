const { checkSchema, validationResult } = require('express-validator'),
  errors = require('./../errors');

const throwValidationErrors = (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return next(errors.invalidParams(validationErrors.array({ onlyFirstError: true }).map(e => e.msg)));
  }
  return next();
};

exports.validateSchema = schema => checkSchema(schema);

exports.validateSchemaAndFail = schema => [exports.validateSchema(schema), throwValidationErrors];
