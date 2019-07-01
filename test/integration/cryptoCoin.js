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
  errors = require('../../app/errors');

chai.use(chaiHttp);

const LOGIN_ENDPOINT = '/users/sessions';
const LIST_COINS_ENDPOINT = userId => `/users/${userId}/coins`;
const LIST_TOP_COINS_ENDPOINT = (userId, order) => `/users/${userId}/coins/top?order=${order}`;

const login = credentials =>
  chai
    .request(server)
    .post(LOGIN_ENDPOINT)
    .send(credentials);

const checkError = (error, statusCode, internalCode) => {
  expect(error.body.status_code).be.equal(statusCode);
  expect(error.body.internal_code).be.equal(internalCode);
};

const listCoins =  (userId, token) =>
  chai
    .request(server)
    .get(LIST_COINS_ENDPOINT(userId))
    .set(constants.AUTHORIZATION_HEADER_NAME, token);

const listTopCoins =  (userId, token, order) =>
  chai
    .request(server)
    .get(LIST_TOP_COINS_ENDPOINT(userId, order))
    .set(constants.AUTHORIZATION_HEADER_NAME, token);

const checkAscOrder = prices => prices.every((_, i) => i == 0 || prices[i] >= prices[i - 1]);
const checkDescOrder = prices => prices.every((_, i) => i == 0 || prices[i] <= prices[i - 1]);



describe('User Controller Integration Tests', () => {
  describe('/users/:id/coins GET', () => {
      let user;

    beforeEach(async () => {
        user = await userFactory.newUser(userMock.genericUser);
        loginRequestResponse = await login({username: userMock.genericUser.username, password: userMock.genericUser.password});
      });


    context('When the user list his coins succesfully', () => {
        let request;
        let createdCoins;
        let coinIds;
        let listCoinIdsResponse;
  
        beforeEach(async () => {
            createdCoins = await cryptoCoinFactory.newCoins(cryptoCoinMock.coinsOfUser(user.id));
            coinIds = createdCoins.map(coin => coin.coin);
            cryptoCoinNock.cryptoCoins.getCoinsInfo.okResponse(user.preferenceMoney, coinIds);
            request = await listCoins(user.id, loginRequestResponse.body.token);
            listCoinIdsResponse = request.body.map(coin => coin.coin_id);

        });
  
        it('checks coins of user', () => {
            expect(coinIds.every(coin => listCoinIdsResponse.includes(coin))).to.equal(true);
            expect(request.statusCode).to.be.equal(200);
        });
      });

      context('When the user tries to list coins of another user', () => {
        let error;
        const randomId = common.getRandomDatabaseInt();
  
        beforeEach(async () => {
          error = await listCoins(randomId, loginRequestResponse.body.token);
        });
  
        it('returns forbidden error', () => {
          checkError(error, statusCodes[errors.FORBIDDEN_ERROR], errors.FORBIDDEN_ERROR);
        });
      });
  });

  describe('/users/:id/coins/top GET', () => {
      let user;

    beforeEach(async () => {
        user = await userFactory.newUser(userMock.genericUser);
        loginRequestResponse = await login({username: userMock.genericUser.username, password: userMock.genericUser.password});
      });


    context('When the user list his top 3 coins succesfully', () => {
        let request;
        let createdCoins;
        let coinIds;
        let prices;

        const makeRequest = order => {
            beforeEach(async () => {
                createdCoins = await cryptoCoinFactory.newCoins(cryptoCoinMock.coinsOfUser(user.id));
                coinIds = createdCoins.map(coin => coin.coin);
                cryptoCoinNock.cryptoCoins.getCoinsInfo.okResponse(user.preferenceMoney, coinIds);
    
                request = await listTopCoins(user.id, loginRequestResponse.body.token, order);
                prices = request.body.map(coin => coin.price);
            });
        };
  
        context('When the top 3 list is sorted descending ', () => {
            const order = 'desc';
            makeRequest(order);

            it('checks top 3 coins by descending order', () => {
                expect(request.statusCode).to.be.equal(200);
                expect(checkDescOrder(prices)).to.equal(true);
            });

        });

        context('When the top 3 list is sorted ascending ', () => {
            const order = 'asc';
            makeRequest(order);

            it('checks top 3 coins by ascending order', () => {
                expect(request.statusCode).to.be.equal(200);
                expect(checkAscOrder(prices)).to.equal(true);
            });
        });
      });

      context('When the user tries to list the top 3 coins of another user', () => {
        let error;
        order = 'desc';
        const randomId = common.getRandomDatabaseInt();
  
        beforeEach(async () => {
          error = await listTopCoins(randomId, loginRequestResponse.body.token, order);
        });
  
        it('returns forbidden error', () => {
          checkError(error, statusCodes[errors.FORBIDDEN_ERROR], errors.FORBIDDEN_ERROR);
        });
      });
  });
});
