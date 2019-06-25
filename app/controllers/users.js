const userService = require('../services/users'),
  userMapper = require('../mappers/users'),
  sessionManager = require('../services/sessionManager');

exports.create = async (req, res, next) => {
  const user = userMapper.create(req.body);
  try {
    const response = await userService.create(user);
    res.status(201).send(response);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const user = req.body;
  try {
    const foundedUser = await sessionManager.login(user);
    const accessToken = await sessionManager.generateAccessToken(foundedUser);
    res.status(200).send({
      token: accessToken.token,
      exp: accessToken.exp
    });
  } catch (err) {
    next(err);
  }
};
