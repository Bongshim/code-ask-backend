const request = require('supertest');
const { User } = require('../../src/models/User');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { userOne, insertUsers } = require('../fixtures/user.fixture');
const { customAccessToken } = require('../fixtures/token.fixture');
const { insertUserAndQuestion } = require('../fixtures/question.fixture');

setupTestDB();

describe('Question routes', () => {
  let question = {};

  describe('POST /v1/api/questions', () => {
    beforeEach(() => {
      question = {
        title: faker.lorem.lines(1),
        body: faker.lorem.paragraph(3),
        tags: [{ name: faker.random.alphaNumeric(5) }],
      };
    });

    test('Should return 201 upon successful creation of question', async () => {
      await insertUsers([userOne]);
      const { id } = await User.findOne({ where: { email: userOne.email } });

      const newUserAccessToken = await customAccessToken(id);

      const res = await request(app)
        .post('/v1/api/questions')
        .set('Accept', 'application/json')
        .auth(newUserAccessToken, { type: 'bearer' })
        .send(question)
        .expect(httpStatus.CREATED);

      expect(res.body).toHaveProperty('UserId');

      expect(res.body).toBeDefined();
    });

    test('Should return 401 upon accessing post route without access token', async () => {
      const res = await request(app)
        .post('/v1/api/questions')
        .set('Accept', 'application/json')
        .send(question)
        .expect(httpStatus.UNAUTHORIZED);

      expect(res.body.message).toBe('Please authenticate');
    });
  });

  describe('GET /v1/api/questions', () => {
    test('Should return 200 upon trying to get questions', async () => {
      const res = await request(app).get('/v1/api/questions').expect(httpStatus.OK);

      expect(res.body).toBeDefined();
    });
  });

  describe('GET /v1/api/questions/id', () => {
    test('Should return 200 upon trying to get a question', async () => {
      const details = await insertUserAndQuestion();
      // details.user.dataValues;
      // details.question.dataValues;

      const newUserAccessToken = await customAccessToken(details.user.dataValues.id);

      const res = await request(app)
        .get(`/v1/api/questions/${details.question.dataValues.id}`)
        .auth(newUserAccessToken, { type: 'bearer' })
        .expect(httpStatus.OK);

      expect(res.body).toBeDefined();
    });

    test('Should return 401 upon trying to get a question without access token', async () => {
      const details = await insertUserAndQuestion();

      const res = await request(app)
        .get(`/v1/api/questions/${details.question.dataValues.id}`)
        .set('Accept', 'application/json')
        .expect(httpStatus.UNAUTHORIZED);

      expect(res.body.message).toBe('Please authenticate');
    });
  });

  describe('PATCH /v1/api/questions/id', () => {
    test('Should return 200 upon trying to udate a question', async () => {
      const details = await insertUserAndQuestion();
      // details.user.dataValues;
      // details.discussion.dataValues;

      const newUserAccessToken = await customAccessToken(details.user.dataValues.id);

      const res = await request(app)
        .patch(`/v1/api/questions/${details.question.dataValues.id}`)
        .auth(newUserAccessToken, { type: 'bearer' })
        .send(question)
        .expect(httpStatus.OK);

      expect(res.body.success).toBe('Updated');
    });

    test('Should return 403 upon trying to update a question without being the owner', async () => {
      const details = await insertUserAndQuestion();
      const details2 = await insertUserAndQuestion();
      // details.user.dataValues;
      // details.discussion.dataValues;

      const newUserAccessToken = await customAccessToken(details2.user.dataValues.id);

      const res = await request(app)
        .patch(`/v1/api/questions/${details.question.dataValues.id}`)
        .auth(newUserAccessToken, { type: 'bearer' })
        .expect(httpStatus.UNAUTHORIZED);

      expect(res.body.message).toBe('Cannot Edit');
    });

    test('Should return 403 upon trying to update a question without being authenticated', async () => {
      const details = await insertUserAndQuestion();

      const res = await request(app)
        .patch(`/v1/api/questions/${details.question.dataValues.id}`)
        .set('Accept', 'application/json')
        .send(question)
        .expect(httpStatus.UNAUTHORIZED);

      expect(res.body.message).toBe('Please authenticate');
    });
  });

  describe('DELETE /v1/api/questions/id', () => {
    test('Should return 200 upon trying to delete a question', async () => {
      const details = await insertUserAndQuestion();
      // details.user.dataValues;
      // details.discussion.dataValues;

      const newUserAccessToken = await customAccessToken(details.user.dataValues.id);

      const res = await request(app)
        .delete(`/v1/api/questions/${details.question.dataValues.id}`)
        .auth(newUserAccessToken, { type: 'bearer' })
        .expect(httpStatus.OK);

      expect(res.body.success).toBe('Deleted');
    });

    test('Should return 403 upon trying to delete a question without being the owner', async () => {
      const details = await insertUserAndQuestion();
      const details2 = await insertUserAndQuestion();
      // details.user.dataValues;
      // details.discussion.dataValues;

      const newUserAccessToken = await customAccessToken(details2.user.dataValues.id);

      const res = await request(app)
        .delete(`/v1/api/questions/${details.question.dataValues.id}`)
        .auth(newUserAccessToken, { type: 'bearer' })
        .expect(httpStatus.UNAUTHORIZED);

      expect(res.body.message).toBe('Cannot Delete');
    });

    test('Should return 403 upon trying to delete a question without an access token', async () => {
      const details = await insertUserAndQuestion();
      // details.user.dataValues;
      // details.question.dataValues;

      const res = await request(app)
        .delete(`/v1/api/questions/${details.question.dataValues.id}`)
        .expect(httpStatus.UNAUTHORIZED);

      expect(res.body.message).toBe('Please authenticate');
    });
  });
});
