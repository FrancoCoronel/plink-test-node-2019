const userService = require('../services/users'),
  userMapper = require('../mappers/users');

exports.create = async (req, res, next) => {
  const user = userMapper.create(req.body);
  try {
    const response = await userService.create(user);
    res.status(201).send(response);
  } catch (err) {
    next(err);
  }
};
