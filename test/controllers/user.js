/* eslint-disable no-undef */
/* eslint-disable init-declarations */
/* eslint-disable require-atomic-updates */
const chai = require('chai'),
  chaiHttp = require('chai-http'),
  { expect } = require('chai'),
  constants = require('../../app/constants'),
  sessionManager = require('./../../app/services/sessionManager'),
  errors = require('../../app/errors'),
  simpleMock = require('simple-mock'),
  server = require('./../../app'),
  userService = require('../../app/services/users'),
  coinService = require('../../app/services/cryptoCoin'),
  userSerializer = require('../../app/serializers/user'),
  cryptoCoinSerializer = require('../../app/serializers/cryptoCoin'),
  userMock = require('../support/mocks/user'),
  errorsMock = require('../support/mocks/errors'),
  coinMock = require('../support/mocks/cryptoCoin');

chai.use(chaiHttp);

const mockFetchers = () => {
  simpleMock.mock(userService, 'getById').resolveWith(userMock.genericUser);
  simpleMock.mock(coinService, 'checkCoin').resolveWith(coinMock.coinInfo);
};

let accessToken;

const createAccessToken = async () => {
  try {
    accessToken = await sessionManager.generateAccessToken(userMock.genericUser);
  } catch (err) {
    throw err;
  }
};

describe('users controller', () => {
  createAccessToken();
  describe('/users/sessions POST', () => {
    let request;
    let foundedUser;

    context('When all interactions work OK', () => {
      beforeEach(async () => {
        foundedUser = simpleMock.mock(sessionManager, 'login').resolveWith(userMock.genericUser);
        accessTokenMock = simpleMock
          .mock(sessionManager, 'generateAccessToken')
          .resolveWith(userMock.accessToken);
        request = await chai
          .request(server)
          .post('/users/sessions')
          .send({
            password: userMock.genericUser.password,
            username: userMock.genericUser.username
          });
      });

      it('calls all expected components with the expected parameters', () => {
        expect(foundedUser.callCount).to.eq(1);
        expect(accessTokenMock.callCount).to.eq(1);
      });

      it('returns status code 200', () => {
        expect(request.status).to.equal(200);
      });

      it('returns token and exp', () => {
        const responseBody = request.body;
        expect(responseBody).to.deep.equal(userMock.accessToken);
      });
    });
    context('When any interaction fails', () => {
      context('When :sessionManager.login fails', () => {
        const errorMessage = `Invalid username: ${userMock.genericUser.username}`;
        beforeEach(async () => {
          invalidUser = simpleMock
            .mock(sessionManager, 'login')
            .rejectWith(errors.credentialsError(errorMessage));

          accessTokenMock = simpleMock
            .mock(sessionManager, 'generateAccessToken')
            .resolveWith(userMock.accessToken);
          request = await chai
            .request(server)
            .post('/users/sessions')
            .send({
              password: userMock.genericUser.password,
              username: userMock.genericUser.username
            });
        });

        it('calls all expected components', () => {
          expect(invalidUser.callCount).to.eq(1);
          expect(accessTokenMock.callCount).to.eq(0);
        });

        it('returns status code 401', () => {
          expect(request.status).to.equal(401);
        });

        it('returns the corresponding error object', () => {
          const responseBody = request.body;
          expect(responseBody).to.deep.equal(errorsMock.credentialsError(errorMessage));
        });
      });
      context('When :sessionManager.generateAccessToken fails', () => {
        const errorMessage = 'Error trying to encode token';
        beforeEach(async () => {
          foundedUser = simpleMock.mock(sessionManager, 'login').resolveWith(userMock.user);
          accessTokenMock = simpleMock
            .mock(sessionManager, 'generateAccessToken')
            .rejectWith(errors.defaultError(errorMessage));
          request = await chai
            .request(server)
            .post('/users/sessions')
            .send({
              password: userMock.genericUser.password,
              username: userMock.genericUser.username
            });
        });

        it('calls all expected components', () => {
          expect(foundedUser.callCount).to.eq(1);
          expect(accessTokenMock.callCount).to.eq(1);
        });

        it('returns status code 500', () => {
          expect(request.status).to.equal(500);
        });

        it('returns the corresponding error object', () => {
          const responseBody = request.body;
          expect(responseBody).to.deep.equal(errorsMock.defaultError(errorMessage));
        });
      });
    });
  });

  describe('/users POST', () => {
    let request;
    let createdUser;
    const userToCreate = {
      username: userMock.userInfo.username,
      password: userMock.userInfo.password,
      first_name: userMock.userInfo.firstName,
      last_name: userMock.userInfo.lastName,
      preference_money: userMock.userInfo.preferenceMoney
    };

    context('When :userService.create works OK', () => {
      beforeEach(async () => {
        mockFetchers();
        createdUser = simpleMock.mock(userService, 'create').resolveWith(userMock.userInfo);
        request = await chai
          .request(server)
          .post('/users')
          .send(userToCreate)
          .set(constants.AUTHORIZATION_HEADER_NAME, accessToken.token);
      });

      it('calls :userService.create method', () => {
        expect(createdUser.callCount).to.eq(1);
      });

      it('returns status code 201', () => {
        expect(request.status).to.equal(201);
      });

      it('returns information of created user', () => {
        const responseBody = request.body;
        expect(responseBody).to.deep.equal(userSerializer.user(userMock.userInfo));
      });
    });

    context('When :userService.create fails', () => {
      const errorMessage = 'Error trying to create a user';
      beforeEach(async () => {
        mockFetchers();
        simpleMock.mock(userService, 'getById').resolveWith(userMock.userInfo);
        failedCreation = simpleMock
          .mock(userService, 'create')
          .rejectWith(errors.databaseError(errorMessage));
        request = await chai
          .request(server)
          .post('/users')
          .send(userToCreate)
          .set(constants.AUTHORIZATION_HEADER_NAME, accessToken.token);
      });

      it('calls :userService.create method', () => {
        expect(failedCreation.callCount).to.eq(1);
      });

      it('returns status code 503', () => {
        expect(request.status).to.equal(503);
      });

      it('returns the corresponding error object', () => {
        const responseBody = request.body;
        expect(responseBody).to.deep.equal(errorsMock.databaseError(errorMessage));
      });
    });
  });
  describe('/users/:id/coins POST', () => {
    let request;
    let addedCoinMock;
    const coinToCreate = {
      coin: coinMock.coinInfo.coin_id
    };

    context('When :userService.createCoin works OK', () => {
      beforeEach(async () => {
        mockFetchers();
        addedCoinMock = simpleMock
          .mock(userService, 'createCoin')
          .resolveWith(coinMock.addedCoinForUser(userMock.genericUser.id));
        request = await chai
          .request(server)
          .post(`/users/${userMock.genericUser.id}/coins`)
          .send(coinToCreate)
          .set(constants.AUTHORIZATION_HEADER_NAME, accessToken.token);
      });

      it('calls :userService.createCoin method', () => {
        expect(addedCoinMock.callCount).to.eq(1);
      });

      it('returns status code 201', () => {
        expect(request.status).to.equal(201);
      });

      it('returns information of created coin for user', () => {
        const responseBody = request.body;
        expect(responseBody).to.deep.equal(
          cryptoCoinSerializer.addedCoinForUser(coinMock.addedCoinForUser(userMock.genericUser.id))
        );
      });
    });

    context('When :userService.createCoin fails', () => {
      const errorMessage = 'Error trying to create a user';
      beforeEach(async () => {
        mockFetchers();
        failedCreation = simpleMock
          .mock(userService, 'createCoin')
          .rejectWith(errors.databaseError(errorMessage));
        request = await chai
          .request(server)
          .post(`/users/${userMock.genericUser.id}/coins`)
          .send(coinToCreate)
          .set(constants.AUTHORIZATION_HEADER_NAME, accessToken.token);
      });

      it('calls all expected components', () => {
        expect(failedCreation.callCount).to.eq(1);
      });

      it('returns status code 503', () => {
        expect(request.status).to.equal(503);
      });

      it('returns the corresponding error object', () => {
        const responseBody = request.body;
        expect(responseBody).to.deep.equal(errorsMock.databaseError(errorMessage));
      });
    });
  });
});
