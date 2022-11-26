const request = require('supertest');
const { User } = require('../../src/models/User');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { userOne, userTwo, admin, insertUsers } = require('../fixtures/user.fixture');
const { customAccessToken } = require('../fixtures/token.fixture');
const { insertUserAndDiscussion } = require('../fixtures/discussion.fixture');

setupTestDB();

describe('Discussion routes', () => {
  let discussion = {};

  describe('POST /v1/api/discussions', () => {
    beforeEach(() => {
      discussion = {
        topic: faker.lorem.lines(1),
      };
    });

    test('Should return 201 upon successful creation of discussion', async () => {
      await insertUsers([admin]);
      const { id } = await User.findOne({ where: { email: admin.email } });

      const newUserAccessToken = await customAccessToken(id);

      const res = await request(app)
        .post('/v1/api/discussions')
        .set('Accept', 'application/json')
        .auth(newUserAccessToken, { type: 'bearer' })
        .send(discussion)
        .expect(httpStatus.CREATED);

      expect(res.body).toEqual({
        id: expect.anything(),
        topic: expect.anything(),
        UserId: expect.anything(),
        updatedAt: expect.anything(),
        createdAt: expect.anything(),
      });
    });

    test('Should return 401 upon accessing route without access token', async () => {
      const res = await request(app)
        .post('/v1/api/discussions')
        .set('Accept', 'application/json')
        .send(discussion)
        .expect(httpStatus.UNAUTHORIZED);

      expect(res.body.message).toBe('Please authenticate');
    });

    test('Should return 403 if the user is not an admin', async () => {
      const newUser2 = userOne;

      await insertUsers([newUser2]);
      const { id } = await User.findOne({ where: { email: newUser2.email } });

      const newUserAccessToken = await customAccessToken(id);

      const res = await request(app)
        .post('/v1/api/discussions')
        .set('Accept', 'application/json')
        .auth(newUserAccessToken, { type: 'bearer' })
        .send(discussion)
        .expect(httpStatus.FORBIDDEN);

      expect(res.body.message).toBe('Forbidden');
    });
  });

  describe('GET /v1/api/discussions', () => {
    test('Should return 200 upon trying to get discussions', async () => {
      const newUser2 = userTwo;

      await insertUsers([newUser2]);
      const { id } = await User.findOne({ where: { email: newUser2.email } });
      const newUserAccessToken = await customAccessToken(id);

      const res = await request(app)
        .get('/v1/api/discussions')
        .auth(newUserAccessToken, { type: 'bearer' })
        .expect(httpStatus.OK);

      expect(res.body).toBeDefined();
    });

    test('Should return 401 upon trying to get discussions without access token', async () => {
      const res = await request(app)
        .get('/v1/api/discussions')
        .set('Accept', 'application/json')
        .expect(httpStatus.UNAUTHORIZED);

      expect(res.body.message).toBe('Please authenticate');
    });
  });

  describe('GET /v1/api/discussions/id', () => {
    test('Should return 200 upon trying to get a discussion', async () => {
      const details = await insertUserAndDiscussion();
      // details.user.dataValues;
      // details.discussion.dataValues;

      const newUserAccessToken = await customAccessToken(details.user.dataValues.id);

      const res = await request(app)
        .get(`/v1/api/discussions/${details.discussion.dataValues.id}`)
        .auth(newUserAccessToken, { type: 'bearer' })
        .expect(httpStatus.OK);

      expect(res.body).toBeDefined();
    });

    test('Should return 401 upon trying to get a discussion without access token', async () => {
      const details = await insertUserAndDiscussion();

      const res = await request(app)
        .get(`/v1/api/discussions/${details.discussion.dataValues.id}`)
        .set('Accept', 'application/json')
        .expect(httpStatus.UNAUTHORIZED);

      expect(res.body.message).toBe('Please authenticate');
    });
  });

  describe('PATCH /v1/api/discussions/id', () => {
    test('Should return 200 upon trying to edit a discussion', async () => {
      const details = await insertUserAndDiscussion('admin');
      // details.user.dataValues;
      // details.discussion.dataValues;

      const newUserAccessToken = await customAccessToken(details.user.dataValues.id);

      const res = await request(app)
        .patch(`/v1/api/discussions/${details.discussion.dataValues.id}`)
        .auth(newUserAccessToken, { type: 'bearer' })
        .send(discussion)
        .expect(httpStatus.OK);

      expect(res.body.success).toBe('Updated');
    });

    test('Should return 403 upon trying to update a discussion without being admin', async () => {
      const details = await insertUserAndDiscussion();

      const newUserAccessToken = await customAccessToken(details.user.dataValues.id);

      const res = await request(app)
        .patch(`/v1/api/discussions/${details.discussion.dataValues.id}`)
        .auth(newUserAccessToken, { type: 'bearer' })
        .set('Accept', 'application/json')
        .send(discussion)
        .expect(httpStatus.FORBIDDEN);

      expect(res.body.message).toBe('Forbidden');
    });
  });

  describe('DELETE /v1/api/discussions/id', () => {
    test('Should return 200 upon trying to delete a discussion as admin', async () => {
      const details = await insertUserAndDiscussion('admin');
      // details.user.dataValues;
      // details.discussion.dataValues;

      const newUserAccessToken = await customAccessToken(details.user.dataValues.id);

      const res = await request(app)
        .delete(`/v1/api/discussions/${details.discussion.dataValues.id}`)
        .auth(newUserAccessToken, { type: 'bearer' })
        .expect(httpStatus.OK);

      expect(res.body.success).toBe('Deleted');
    });

    test('Should return 403 upon trying to delete a discussion without being admin', async () => {
      const details = await insertUserAndDiscussion();
      // details.user.dataValues;
      // details.discussion.dataValues;

      const newUserAccessToken = await customAccessToken(details.user.dataValues.id);

      const res = await request(app)
        .delete(`/v1/api/discussions/${details.discussion.dataValues.id}`)
        .auth(newUserAccessToken, { type: 'bearer' })
        .expect(httpStatus.FORBIDDEN);

      expect(res.body.message).toBe('Forbidden');
    });
  });
});
