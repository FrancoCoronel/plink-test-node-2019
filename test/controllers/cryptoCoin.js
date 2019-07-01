/* eslint-disable */

const chai = require('chai'),
  chaiHttp = require('chai-http'),
  { expect } = require('chai'),
  constants = require('../../app/constants'),
  sessionManager = require('./../../app/services/sessionManager'),
  errors = require('../../app/errors'),
  simpleMock = require('simple-mock'),
  server = require('./../../app'),
  userService = require('../../app/services/users'),
  cryptoCoinService = require('../../app/services/cryptoCoin'),
  cryptoCoinSerializer = require('../../app/serializers/cryptoCoin'),
  userMock = require('../support/mocks/user'),
  errorsMock = require('../support/mocks/errors'),
  cryptoCoinMock = require('../support/mocks/cryptoCoin');

chai.use(chaiHttp);

const mockFetchers = () => {
  simpleMock.mock(userService, 'getById').resolveWith(userMock.genericUser);
  simpleMock.mock(cryptoCoinService, 'checkCoin').resolveWith(cryptoCoinMock.coinInfo);
};

let accessToken;

const createAccessToken = async () => {
  try {
    accessToken = await sessionManager.generateAccessToken(userMock.genericUser);
  } catch (err) {
    throw err;
  }
};

const COINS_FOR_USER_ENDPOINT = userId => `/users/${userId}/coins`;
const TOP_COINS_FOR_USER_ENDPOINT = userId => `/users/${userId}/coins/top`;

describe('crytoCoin controller', () => {
  createAccessToken();
  describe('/users/:id/coins GET', () => {
    let request;
    let coinsOfUserFunc;
    let currentlyCoinsInfoFunc;
    const coinsOfUser = cryptoCoinMock.coinsOfUser(userMock.genericUser.id);
    const currentlyCoinsInfo = cryptoCoinMock.currentlyCoinsInfo(coinsOfUser);

    context('When all interactions work OK', () => {
      beforeEach(async () => {
        mockFetchers();

        coinsOfUserFunc = simpleMock.mock(cryptoCoinService, 'getCoinsOfUser').resolveWith(coinsOfUser);

        currentlyCoinsInfoFunc = simpleMock
          .mock(cryptoCoinService, 'getCurrentlyCoinsInfo')
          .resolveWith(currentlyCoinsInfo);

        request = await chai
          .request(server)
          .get(COINS_FOR_USER_ENDPOINT(userMock.genericUser.id))
          .set(constants.AUTHORIZATION_HEADER_NAME, accessToken.token);
      });

      it('calls all expected components with the expected parameters', () => {
        expect(coinsOfUserFunc.callCount).to.eq(1);
        expect(currentlyCoinsInfoFunc.callCount).to.eq(1);
      });

      it('returns status code 200', () => {
        expect(request.status).to.equal(200);
      });

      it('returns coins of user', () => {
        const responseBody = request.body;
        expect(responseBody).to.deep.equal(cryptoCoinSerializer.coinsInfo(currentlyCoinsInfo));
      });
    });

    context('When any interaction fails', () => {
      context('When :cryptoCoinService.getCoinsOfUser fails', () => {
        const errorMessage = `Error while trying to get coins of user with id ${userMock.genericUser.id}`;

        beforeEach(async () => {
          mockFetchers();
          getCoinsOfUserFails = simpleMock
            .mock(cryptoCoinService, 'getCoinsOfUser')
            .rejectWith(errors.databaseError(errorMessage));

          currentlyCoinsInfoFunc = simpleMock
            .mock(cryptoCoinService, 'getCurrentlyCoinsInfo')
            .resolveWith(currentlyCoinsInfo);

          request = await chai
            .request(server)
            .get(COINS_FOR_USER_ENDPOINT(userMock.genericUser.id))
            .set(constants.AUTHORIZATION_HEADER_NAME, accessToken.token);
        });

        it('calls all expected components', () => {
          expect(getCoinsOfUserFails.callCount).to.eq(1);
          expect(currentlyCoinsInfoFunc.callCount).to.eq(0);
        });

        it('returns status code 503', () => {
          expect(request.status).to.equal(503);
        });

        it('returns the corresponding error object', () => {
          const responseBody = request.body;
          expect(responseBody).to.deep.equal(errorsMock.databaseError(errorMessage));
        });
      });

      context('When :cryptoCoinService.getCurrentlyCoinsInfo fails', () => {
        const error = {
          success: false,
          error: 'The coin specified is not available'
        };
        beforeEach(async () => {
          mockFetchers();
          coinsOfUserFunc = simpleMock.mock(cryptoCoinService, 'getCoinsOfUser').resolveWith(coinsOfUser);

          currentlyCoinsInfoFunc = simpleMock
            .mock(cryptoCoinService, 'getCurrentlyCoinsInfo')
            .rejectWith(errors.coinApiError(error));

          request = await chai
            .request(server)
            .get(COINS_FOR_USER_ENDPOINT(userMock.genericUser.id))
            .set(constants.AUTHORIZATION_HEADER_NAME, accessToken.token);
        });

        it('calls all expected components', () => {
          expect(coinsOfUserFunc.callCount).to.eq(1);
          expect(currentlyCoinsInfoFunc.callCount).to.eq(1);
        });

        it('returns status code 503', () => {
          expect(request.status).to.equal(503);
        });

        it('returns the corresponding error object', () => {
          const responseBody = request.body;
          expect(responseBody).to.deep.equal(errorsMock.coinApiError(error.error));
        });
      });
    });
  });

  describe('/users/:id/coins/top GET', () => {
    let request;
    let coinsOfUserFunc;
    let currentlyCoinsInfoFunc;
    const coinsOfUser = cryptoCoinMock.coinsOfUser(userMock.genericUser.id);
    const currentlyCoinsInfo = cryptoCoinMock.currentlyCoinsInfo(coinsOfUser);

    context('When all interactions work OK', () => {
      beforeEach(async () => {
        mockFetchers();

        coinsOfUserFunc = simpleMock.mock(cryptoCoinService, 'getCoinsOfUser').resolveWith(coinsOfUser);

        currentlyCoinsInfoFunc = simpleMock
          .mock(cryptoCoinService, 'getTop3CoinsInfo')
          .resolveWith(currentlyCoinsInfo);

        request = await chai
          .request(server)
          .get(TOP_COINS_FOR_USER_ENDPOINT(userMock.genericUser.id))
          .set(constants.AUTHORIZATION_HEADER_NAME, accessToken.token);
      });

      it('calls all expected components with the expected parameters', () => {
        expect(coinsOfUserFunc.callCount).to.eq(1);
        expect(currentlyCoinsInfoFunc.callCount).to.eq(1);
      });

      it('returns status code 200', () => {
        expect(request.status).to.equal(200);
      });

      it('returns top 3 coins of user', () => {
        const responseBody = request.body;
        expect(responseBody).to.deep.equal(cryptoCoinSerializer.coinsInfo(currentlyCoinsInfo));
      });
    });

    context('When any interaction fails', () => {
      context('When :cryptoCoinService.getCoinsOfUser fails', () => {
        const errorMessage = `Error while trying to get coins of user with id ${userMock.genericUser.id}`;

        beforeEach(async () => {
          mockFetchers();
          getCoinsOfUserFails = simpleMock
            .mock(cryptoCoinService, 'getCoinsOfUser')
            .rejectWith(errors.databaseError(errorMessage));

          currentlyCoinsInfoFunc = simpleMock
            .mock(cryptoCoinService, 'getCurrentlyCoinsInfo')
            .resolveWith(currentlyCoinsInfo);

          request = await chai
            .request(server)
            .get(TOP_COINS_FOR_USER_ENDPOINT(userMock.genericUser.id))
            .set(constants.AUTHORIZATION_HEADER_NAME, accessToken.token);
        });

        it('calls all expected components', () => {
          expect(getCoinsOfUserFails.callCount).to.eq(1);
          expect(currentlyCoinsInfoFunc.callCount).to.eq(0);
        });

        it('returns status code 503', () => {
          expect(request.status).to.equal(503);
        });

        it('returns the corresponding error object', () => {
          const responseBody = request.body;
          expect(responseBody).to.deep.equal(errorsMock.databaseError(errorMessage));
        });
      });

      context('When :cryptoCoinService.getTop3CoinsInfo fails', () => {
        const error = {
          success: false,
          error: 'The coin specified is not available'
        };
        beforeEach(async () => {
          mockFetchers();
          coinsOfUserFunc = simpleMock.mock(cryptoCoinService, 'getCoinsOfUser').resolveWith(coinsOfUser);

          currentlyCoinsInfoFunc = simpleMock
            .mock(cryptoCoinService, 'getTop3CoinsInfo')
            .rejectWith(errors.coinApiError(error));

          request = await chai
            .request(server)
            .get(TOP_COINS_FOR_USER_ENDPOINT(userMock.genericUser.id))
            .set(constants.AUTHORIZATION_HEADER_NAME, accessToken.token);
        });

        it('calls all expected components', () => {
          expect(coinsOfUserFunc.callCount).to.eq(1);
          expect(currentlyCoinsInfoFunc.callCount).to.eq(1);
        });

        it('returns status code 503', () => {
          expect(request.status).to.equal(503);
        });

        it('returns the corresponding error object', () => {
          const responseBody = request.body;
          expect(responseBody).to.deep.equal(errorsMock.coinApiError(error.error));
        });
      });
    });
  });
});
