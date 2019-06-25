const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.DATABASE_ERROR = 'database_error';
exports.databaseError = message => internalError(message, exports.DATABASE_ERROR);

exports.DEFAULT_ERROR = 'default_error';
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);

exports.NOT_FOUND = 'not_found';
exports.notFound = message => internalError(message, exports.DEFAULT_ERROR);

exports.INVALID_PARAMS = 'invalid_params';
exports.invalidParams = errors => internalError(errors, exports.INVALID_PARAMS);

exports.VALIDATION_ERROR = 'validation_error';
exports.validationError = message => internalError(message, exports.VALIDATION_ERROR);
