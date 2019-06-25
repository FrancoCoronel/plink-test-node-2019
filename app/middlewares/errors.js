const errors = require('../errors');

const DEFAULT_STATUS_CODE = 500;

const statusCodes = {
  [errors.NOT_FOUND]: 404,
  [errors.DATABASE_ERROR]: 503,
  [errors.DEFAULT_ERROR]: 500,
  [errors.CREDENTIALS_ERROR]: 401,
  [errors.NO_AUTHORIZATION_ERROR]: 401,
  [errors.BAD_REQUEST_ERROR]: 400,
  [errors.FORBIDDEN_ERROR]: 403,
  [errors.VALIDATION_ERROR]: 400,
  [errors.INVALID_PARAMS]: 422,
  [errors.GPS_GATE_ERROR]: 503
};

const sequelizeError = error =>
  error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError';

const parameterError = error => error.name === 'ParameterMissingError';

exports.handle = (error, req, res, next) => {
  let status = '';
  if (sequelizeError(error) || parameterError(error)) {
    error.internalCode = 'validation_error';
  }
  if (error.internalCode) {
    status = statusCodes[error.internalCode] || DEFAULT_STATUS_CODE;
  } else {
    // Unrecognized error, notifying it to rollbar.
    next(error);
    status = exports.DEFAULT_STATUS_CODE;
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
