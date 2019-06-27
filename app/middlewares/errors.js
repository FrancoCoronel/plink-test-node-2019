/* eslint-disable no-unused-vars */
const errors = require('../errors');

const DEFAULT_STATUS_CODE = 500;

const statusCodes = {
  [errors.NOT_FOUND]: 404,
  [errors.DATABASE_ERROR]: 503,
  [errors.CREDENTIALS_ERROR]: 401,
  [errors.TOKEN_EXPIRATION_ERROR]: 400,
  [errors.BAD_REQUEST_ERROR]: 400,
  [errors.FORBIDDEN_ERROR]: 403,
  [errors.VALIDATION_ERROR]: 400,
  [errors.INVALID_PARAMS]: 422,
  [errors.COIN_API_ERROR]: 503,
  [errors.DEFAULT_ERROR]: 500
};

const errorFromCoinApi = error => error.internalCode === errors.COIN_API_ERROR;

const sequelizeError = error =>
  error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError';

const parameterError = error => error.name === 'ParameterMissingError';

const handleInternalError = (error, req, res, next) => {
  let status = '';
  if (sequelizeError(error) || parameterError(error)) {
    error.internalCode = 'validation_error';
  }
  if (error.internalCode) {
    status = statusCodes[error.internalCode] || DEFAULT_STATUS_CODE;
  }
  res.status(status);

  const response = {
    status_code: status,
    origin: 'PlinkApi',
    errors: error.messages || [error.message],
    internal_code: error.internalCode
  };

  return res.send(response);
};

const handleCoinApirError = (error, req, res, next) => {
  const status = statusCodes[error.internalCode];
  res.status(status);
  const response = {
    status_code: status,
    origin: 'coinApiServer',
    errors: error.message,
    internal_code: error.internalCode
  };
  return res.send(response);
};

exports.handle = (error, req, res, next) => {
  if (errorFromCoinApi(error)) {
    return handleCoinApirError(error, req, res, next);
  }
  return handleInternalError(error, req, res, next);
};
