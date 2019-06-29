/* eslint-disable */

const chai = require('chai'),
  chaiHttp = require('chai-http'),
  { expect } = require('chai'),
  constants = require('../../app/constants'),
  common = require('../support/common'),
  server = require('./../../app'),
  userMock = require('../support/mocks/user'),
  cryptoCoinMock = require('../support/mocks/cryptoCoin'),
  cryptoCoinNock = require('../support/nocks/cryptoCoinApi'),
  userFactory = require('../factories/user'),
  cryptoCoinFactory = require('../factories/cryptoCoin'),
  { statusCodes } = require('../../app/middlewares/errors'),
  errorsCatalog = require('../../app/constants/errorsCatalog'),
  errors = require('../../app/errors'),
  User = require('../../app/models').user,
  CryptoCoin = require('../../app/models').crypto_coin;

chai.use(chaiHttp);

const LOGIN_ENDPOINT = '/users/sessions';
const CREATE_USER_ENDPOINT = '/users';
const ADD_COIN_ENDPOINT = userId => `/users/${userId}/coins`;

const login = credentials =>
  chai
    .request(server)
    .post(LOGIN_ENDPOINT)
    .send(credentials);

const checkError = (error, statusCode, internalCode) => {
  expect(error.body.status_code).be.equal(statusCode);
  expect(error.body.internal_code).be.equal(internalCode);
};

const createUser = (userToCreate, token) =>
  chai
    .request(server)
    .post(CREATE_USER_ENDPOINT)
    .send(userToCreate)
    .set(constants.AUTHORIZATION_HEADER_NAME, token);

const addCoin = (coin, userId, token) =>
  chai
    .request(server)
    .post(ADD_COIN_ENDPOINT(userId))
    .send({ coin })
    .set(constants.AUTHORIZATION_HEADER_NAME, token);

describe('User Controller Integration Tests', () => {
  describe('/users/session POST', () => {

    context('When the given credentials are valid', () => {
      let request;
      const validCredentials = {
        username: userMock.genericUser.username,
        password: userMock.genericUser.password
      };

      beforeEach(async () => {
        await userFactory.newUser(userMock.genericUser);
        request = await login(validCredentials);
      });

      it('Logins successfully', () => {
        expect(request.body).have.property('token');
        expect(request.body).have.property('exp');
      });
    });

    context('When the given credentials are invalid', () => {
      let error;

      beforeEach(async () => {
        await userFactory.newUser(userMock.genericUser);
      });

      context('When username is invalid', () => {
        const invalidUsername = {
          username: 'invalidUsername',
          password: userMock.genericUser.password
        };

        beforeEach(async () => {
          error = await login(invalidUsername);
        });

        it('returns credentials error', () => {
          checkError(error, statusCodes[errors.CREDENTIALS_ERROR], errors.CREDENTIALS_ERROR);
        });
      });

      context('When password is invalid', () => {
        const invalidPassword = {
          username: userMock.genericUser.username,
          password: 'invalidPassword'
        };

        beforeEach(async () => {
          error = await login(invalidPassword);
        });

        it('returns credentials error', () => {
          checkError(error, statusCodes[errors.CREDENTIALS_ERROR], errors.CREDENTIALS_ERROR);
        });
      });
    });

    const bodyParams = ['username', 'password'];
    const errorMessageMap = {
      username: [errorsCatalog.paramValidations.USERNAME],
      password: [errorsCatalog.paramValidations.PASSWORD]
    };

    bodyParams.forEach(param => {
      context(`When send a body without ${param}`, () => {
        const loginBody = {
          username: userMock.genericUser.username,
          password: userMock.genericUser.password
        };
        delete loginBody[param];

        beforeEach(async () => {
          error = await login(loginBody);
        });

        it('returns invalid params error', () => {
          expect(error.statusCode).to.equal(422);
          expect(error.body.origin).to.equal('PlinkApi');
          expect(error.body.errors).to.deep.equal(errorMessageMap[param]);
          expect(error.body.internal_code).to.deep.equal(errors.INVALID_PARAMS);
        });
      });
    });
  });

  describe('/users POST', () => {
    const { username, password } = userMock.genericUser;
    const first_name = userMock.genericUser.firstName;
    const last_name = userMock.genericUser.lastName;
    const preference_money = userMock.genericUser.preferenceMoney;
    let loginRequestResponse;

    beforeEach(async () => {
      const ramdomId = common.getRandomDatabaseInt();
      await userFactory.newUser({id: ramdomId, username: 'newUser'});
      loginRequestResponse = await login({username: 'newUser', password: userMock.genericUser.password});
    });

    context('When the given params to create a user are valid', () => {
      let request;
      let oldCount;
      const userToCreate = {
        username,
        first_name,
        last_name,
        password,
        preference_money
      };

      beforeEach(async () => {
        oldCount = await User.count();
        request = await createUser(userToCreate, loginRequestResponse.body.token);
      });

      it('creates a user successfully', async () => {
        const newCount = await User.count();
        const createdUser = await User.findByPk(request.body.id);
        expect(createdUser.username).to.be.equal(userToCreate.username);
        expect(createdUser.firstName).to.be.equal(userToCreate.first_name);
        expect(createdUser.lastName).to.be.equal(userToCreate.last_name);
        expect(createdUser.preferenceMoney).to.be.equal(userToCreate.preference_money);
        expect(newCount).to.be.equal(oldCount + 1);
      });
    });

    context('When the given params to create a user are invalid', () => {
      let error;

      context(`When Preference Money is not one of permitted values ${constants.PREFERENCE_MONEY}`, () => {
        const userToCreate = {
          username,
          password,
          first_name,
          last_name,
          preference_money: 'invalidCoin'
        };

        beforeEach(async () => {
          error = await createUser(userToCreate, loginRequestResponse.body.token);
        });

        it('returns invalid params error', () => {
          checkError(error, statusCodes[errors.INVALID_PARAMS], errors.INVALID_PARAMS);
        });
      });

      context('When password is not alphanumeric', () => {
        const userToCreate = {
          username,
          password: '$pruebas123$',
          first_name,
          last_name,
          preference_money
        };

        beforeEach(async () => {
          error = await createUser(userToCreate, loginRequestResponse.body.token);
        });

        it('returns invalid params error', () => {
          checkError(error, statusCodes[errors.INVALID_PARAMS], errors.INVALID_PARAMS);
        });
      });

      context('When password has a length less than eight characters', () => {
        const userToCreate = {
          username,
          password: '123Al',
          first_name,
          last_name,
          preference_money
        };

        beforeEach(async () => {
          error = await createUser(userToCreate, loginRequestResponse.body.token);
        });

        it('returns invalid params error', () => {
          checkError(error, statusCodes[errors.INVALID_PARAMS], errors.INVALID_PARAMS);
        });
      });
    });

    const bodyParams = ['username', 'password', 'first_name', 'last_name', 'preference_money'];
    const errorMessageMap = {
      username: [errorsCatalog.paramValidations.USERNAME],
      password: [errorsCatalog.paramValidations.PASSWORD],
      first_name: [errorsCatalog.paramValidations.FIRST_NAME],
      last_name: [errorsCatalog.paramValidations.LAST_NAME],
      preference_money: [errorsCatalog.paramValidations.PREFERENCE_MONEY]
    };

    bodyParams.forEach(param => {
      context(`When send a body without ${param}`, () => {
        const userDelete = {
          username: userMock.genericUser.username,
          password: userMock.genericUser.password,
          first_name: userMock.genericUser.firstName,
          last_name: userMock.genericUser.lastName,
          preference_money: userMock.genericUser.preferenceMoney
        };
        delete userDelete[param];

        beforeEach(async () => {
          error = await createUser(userDelete, loginRequestResponse.body.token);
        });

        it('returns invalid params error', () => {
          expect(error.statusCode).to.equal(422);
          expect(error.body.origin).to.equal('PlinkApi');
          expect(error.body.errors).to.deep.equal(errorMessageMap[param]);
          expect(error.body.internal_code).to.deep.equal(errors.INVALID_PARAMS);
        });
      });
    });

    context('When the username already exists', () => {
      let error;
      let oldCount;
      const userToCreate = {
        username,
        first_name,
        last_name,
        password,
        preference_money
      };

      beforeEach(async () => {
        await createUser(userToCreate, loginRequestResponse.body.token);
        oldCount = await User.count();
        error = await createUser(userToCreate, loginRequestResponse.body.token);
      });
      it('returns dataBase error', () => {
        checkError(error, statusCodes[errors.DATABASE_ERROR], errors.DATABASE_ERROR);
      });

      it('checks equal number of users in dataBase', async () => {
        const newCount = await User.count();
        expect(newCount).to.be.equal(oldCount);
      });
    });
  });

  describe('/users/:id/coins POST', () => {
    let user;
    let loginRequestResponse;

    beforeEach(async () => {
      user = await userFactory.newUser(userMock.genericUser);
      loginRequestResponse = await login({username: userMock.genericUser.username, password: userMock.genericUser.password})
    });

    context('When the given coin to add is valid', () => {
      let oldCount;
      const coin = cryptoCoinMock.ramdomValidCoin();

      beforeEach(async () => {
        cryptoCoinNock.cryptoCoins.checkCoin.okResponse(user.preferenceMoney);
        oldCount = await CryptoCoin.count();
        request = await addCoin(coin, user.id, loginRequestResponse.body.token);
      });

      it('creates a coin for user successfully', async () => {
        const newCount = await CryptoCoin.count();
        const addedCoin = await CryptoCoin.findOne({ where: { userId: user.id, coin } });
        expect(addedCoin.userId).to.be.equal(user.id);
        expect(addedCoin.coin).to.be.equal(coin);
        expect(newCount).to.be.equal(oldCount + 1);
      });
    });

    context('When the user has already add the given coin ', () => {
      let error;

      beforeEach(async () => {
        cryptoCoinNock.cryptoCoins.checkCoin.okResponse(user.preferenceMoney);
        await cryptoCoinFactory.newCoin(user.id, user.preferenceMoney);
        error = await addCoin(user.preferenceMoney, user.id, loginRequestResponse.body.token);
      });

      it('returns validation error', () => {
        checkError(error, statusCodes[errors.VALIDATION_ERROR], errors.VALIDATION_ERROR);
      });
    });

    context('When the given coin not exists', () => {
      let error;
      const coin = 'invalidCoin';

      beforeEach(async () => {
        cryptoCoinNock.cryptoCoins.checkCoin.notFoundResponse(coin);
        error = await addCoin(coin, user.id, loginRequestResponse.body.token);
      });

      it('returns Coin Api error', () => {
        checkError(error, statusCodes[errors.COIN_API_ERROR], errors.COIN_API_ERROR);
      });
    });

    context('When the user tries to add a coin to another user', () => {
      let error;
      const randomId = common.getRandomDatabaseInt();

      beforeEach(async () => {
        cryptoCoinNock.cryptoCoins.checkCoin.okResponse(user.preferenceMoney);
        error = await addCoin(user.preferenceMoney, randomId, loginRequestResponse.body.token);
      });

      it('returns validation error', () => {
        checkError(error, statusCodes[errors.FORBIDDEN_ERROR], errors.FORBIDDEN_ERROR);
      });
    });
  });
});
