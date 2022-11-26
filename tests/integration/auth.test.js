const request = require('supertest');
const moment = require('moment');
const { tokenService } = require('../../src/services');
const { Token } = require('../../src/models/Token');
const { User } = require('../../src/models/User');
const config = require('../../src/config/config');
const { tokenTypes } = require('../../src/config/tokens');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const ApiError = require('../../src/utils/ApiError');
const setupTestDB = require('../utils/setupTestDB');
const logger = require('../../src/config/logger');
const { userOne, admin, insertUsers } = require('../fixtures/user.fixture');
const { customAccessToken } = require('../fixtures/token.fixture');

setupTestDB();

describe('Auth routes', () => {
  let newUser = {};

  describe('POST /v1/api/auth/signup', () => {
    beforeEach(() => {
      newUser = {
        username: `${faker.name.lastName()}_${faker.datatype.uuid()}`,
        email: `${faker.datatype.uuid()}_${faker.internet.email().toLowerCase()}`,
        password: '1dadsA23448@sdf596',
      };
    });

    test('Should return 201 upon successful registration', async () => {
      const res = await request(app).post('/v1/api/auth/signup').send(newUser).expect(httpStatus.CREATED);

      expect(res.body.user).not.toHaveProperty('password');
      expect(res.body.user).toEqual({
        id: expect.anything(),
        username: newUser.username,
        profile_image: expect.anything(),
        role: 'user',
      });

      expect(res.body.tokens).toEqual({
        access: { token: expect.anything(), expires: expect.anything() },
        refresh: { token: expect.anything(), expires: expect.anything() },
      });
    });

    test('Should return 400 error if email is already in use', async () => {
      await insertUsers([userOne]);
      newUser.email = userOne.email;

      const res = await request(app).post('/v1/api/auth/signup').send(newUser).expect(httpStatus.BAD_REQUEST);

      expect(res.body.message).toEqual('Email already taken');
    });

    test('Should return 400 error if the password is not valid', async () => {
      newUser.password = `12345`;

      const res = await request(app).post('/v1/api/auth/signup').send(newUser).expect(httpStatus.BAD_REQUEST);

      expect(res.body.message).toEqual('Password validation failed');
    });
  });

  describe('POST /v1/api/auth/signin', () => {
    test('Should return 200 upon successful login', async () => {
      const newUser2 = userOne;

      const loginInfo = {
        email: newUser2.email,
        password: newUser2.password,
      };
      const res = await request(app).post('/v1/api/auth/signin').send(loginInfo).expect(httpStatus.OK);

      expect(res.body.user).not.toHaveProperty('password');
      expect(res.body.user).toEqual({
        id: expect.anything(),
        username: expect.anything(),
        profile_image: expect.anything(),
        role: expect.anything(),
      });

      expect(res.body.tokens).toEqual({
        access: { token: expect.anything(), expires: expect.anything() },
        refresh: { token: expect.anything(), expires: expect.anything() },
      });
    });

    test('Should return 401 upon receiving wrong password', async () => {
      const newUser2 = userOne;

      const loginInfo = {
        email: newUser2.email,
        password: '12345kkdgksd@4',
      };

      const res = await request(app).post('/v1/api/auth/signin').send(loginInfo).expect(httpStatus.UNAUTHORIZED);

      expect(res.body.message).toEqual('Incorrect email or password');
    });

    test('Should return 401 upon receiving wrong email', async () => {
      const newUser2 = userOne;

      const loginInfo = {
        email: '124@gmail.com',
        password: newUser2.password,
      };

      const res = await request(app).post('/v1/api/auth/signin').send(loginInfo).expect(httpStatus.UNAUTHORIZED);

      expect(res.body.message).toEqual('Incorrect email or password');
    });
  });

  describe('POST /v1/api/auth/logout', () => {
    test('should return 204 if refresh token is valid', async () => {
      await insertUsers([newUser]);
      const { id } = await User.findOne({ where: { email: newUser.email } });

      const expires = moment().add(config.jwt.refreshExpirationDays, 'days');
      const refreshToken = tokenService.generateToken(id, expires, tokenTypes.REFRESH);
      await tokenService.saveToken(refreshToken, id, expires, tokenTypes.REFRESH);

      await request(app).post('/v1/api/auth/logout').send({ refreshToken }).expect(httpStatus.NO_CONTENT);

      const dbRefreshTokenDoc = await Token.findOne({ where: { token: refreshToken } });
      
      expect(dbRefreshTokenDoc).toBe(null);
    });

    test('should return 400 error if refresh token is missing from request body', async () => {
      await request(app).post('/v1/api/auth/logout').send().expect(httpStatus.BAD_REQUEST);
    });
  });
});
