const moment = require('moment'),
  errors = require('../errors'),
  constants = require('./../constants'),
  userService = require('../services/users'),
  sessionManager = require('../services/sessionManager'),
  logger = require('../logger');

const getUserInformation = id => userService.getById(id);

const userNotFound = () => errors.notFound('User not found');

const expiredToken = () => errors.tokenExpirationError('Expired Token');

const missingToken = () => errors.badRequestError('the token is NOT present');

const isValidToken = tokenPayload => {
  const now = moment();
  return now.isBefore(tokenPayload.exp);
};

const loadInfoOnRequest = async (payload, req) => {
  const userId = payload.id;
  try {
    const userInfo = await getUserInformation(userId);
    if (!userInfo) {
      throw userNotFound();
    }
    if (!isValidToken(payload)) {
      throw expiredToken();
    }
    req.user = userInfo;
    return req;
  } catch (err) {
    throw err;
  }
};

exports.fetch = async (req, res, next) => {
  let userToken = req.headers[constants.AUTHORIZATION_HEADER_NAME];

  if (!userToken) {
    return next(missingToken());
  }

  try {
    userToken = userToken.split(' ').pop();
    const tokenPayload = sessionManager.decode(userToken);
    await loadInfoOnRequest(tokenPayload, req);
    return next();
  } catch (err) {
    logger.info(`Error in userFecther: ${err}`);
    return next(err);
  }
};
