const request = require('supertest');
const { User } = require('../../src/models/User');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { userOne, userTwo, insertUsers, insertUser } = require('../fixtures/user.fixture');
const { customAccessToken } = require('../fixtures/token.fixture');
const { insertUserAndQuestion } = require('../fixtures/question.fixture');
const { insertUserAndAnswer } = require('../fixtures/answer.fixture');

setupTestDB();

describe('Answer routes', () => {
  let answer = {};

  describe('POST /v1/api/answers', () => {
    beforeEach(() => {
      answer = {
        content: faker.lorem.paragraph(3),
      };
    });

    test('Should return 201 upon successful creation of answer', async () => {
      await insertUsers([userOne]);
      const { id } = await User.findOne({ where: { email: userOne.email } });

      const details = await insertUserAndQuestion();

      answer.QuestionId = details.question.dataValues.id;

      const newUserAccessToken = await customAccessToken(id);

      const res = await request(app)
        .post('/v1/api/answers')
        .set('Accept', 'application/json')
        .auth(newUserAccessToken, { type: 'bearer' })
        .send(answer);

      expect(res.body).toHaveProperty('UserId');

      expect(res.body).toBeDefined();
    });

    test('Should return 404 when questionId passed in does not exist', async () => {
      await insertUsers([userTwo]);
      const { id } = await User.findOne({ where: { email: userTwo.email } });

      const details = await insertUserAndQuestion();

      answer.QuestionId = `${details.question.dataValues.id + 10}`;

      const newUserAccessToken = await customAccessToken(id);

      await request(app)
        .post('/v1/api/answers')
        .set('Accept', 'application/json')
        .auth(newUserAccessToken, { type: 'bearer' })
        .send(answer)
        .expect(httpStatus.NOT_FOUND);
    });

    test('Should return 401 upon accessing post route without access token', async () => {
      const res = await request(app)
        .post('/v1/api/answers')
        .set('Accept', 'application/json')
        .send(answer)
        .expect(httpStatus.UNAUTHORIZED);

      expect(res.body.message).toBe('Please authenticate');
    });
  });

  describe('GET /v1/api/answers', () => {
    test('Should return 200 upon trying to get questions', async () => {
      const user = await insertUser();

      const newUserAccessToken = await customAccessToken(user.dataValues.id);

      const res = await request(app)
        .get('/v1/api/answers')
        .set('Accept', 'application/json')
        .auth(newUserAccessToken, { type: 'bearer' })
        .expect(httpStatus.OK);

      expect(res.body).toBeDefined();
    });
  });

  describe('GET /v1/api/answers/id', () => {
    test('Should return 200 upon trying to get an answer', async () => {
      const userAndQuestion = await insertUserAndQuestion();
      // details.user.dataValues;
      // details.question.dataValues;
      const userAndAnswer = await insertUserAndAnswer(userAndQuestion.question.dataValues.id);

      const newUserAccessToken = await customAccessToken(userAndAnswer.user.dataValues.id);

      const res = await request(app)
        .get(`/v1/api/answers/${userAndAnswer.answer.dataValues.id}`)
        .auth(newUserAccessToken, { type: 'bearer' })
        .expect(httpStatus.OK);

      expect(res.body).toBeDefined();
    });

    test('Should return 401 upon trying to get a answer without access token', async () => {
      const userAndQuestion = await insertUserAndQuestion();
      // details.user.dataValues;
      // details.question.dataValues;
      const userAndAnswer = await insertUserAndAnswer(userAndQuestion.question.dataValues.id);

      const res = await request(app)
        .get(`/v1/api/questions/${userAndAnswer.answer.dataValues.id}`)
        .set('Accept', 'application/json')
        .expect(httpStatus.UNAUTHORIZED);

      expect(res.body.message).toBe('Please authenticate');
    });
  });

  describe('PATCH /v1/api/answers/id', () => {
    test('Should return 200 upon trying to update an answer', async () => {
      const userAndQuestion = await insertUserAndQuestion();
      // details.user.dataValues;
      // details.question.dataValues;
      const userAndAnswer = await insertUserAndAnswer(userAndQuestion.question.dataValues.id);

      const newUserAccessToken = await customAccessToken(userAndAnswer.user.dataValues.id);

      const res = await request(app)
        .patch(`/v1/api/answers/${userAndAnswer.answer.dataValues.id}`)
        .auth(newUserAccessToken, { type: 'bearer' })
        .send(answer)
        .expect(httpStatus.OK);

      expect(res.body.success).toBe('Updated');
    });

    test('Should return 403 upon trying to update an answer without being the owner', async () => {
      const userAndQuestion = await insertUserAndQuestion();
      // details.user.dataValues;
      // details.question.dataValues;
      const userAndAnswer = await insertUserAndAnswer(userAndQuestion.question.dataValues.id);

      const user = await insertUser();

      const newUserAccessToken = await customAccessToken(user.dataValues.id);

      const res = await request(app)
        .patch(`/v1/api/answers/${userAndAnswer.answer.dataValues.id}`)
        .auth(newUserAccessToken, { type: 'bearer' })
        .send(answer)
        .expect(httpStatus.UNAUTHORIZED);

      expect(res.body.message).toBe('Cannot edit');
    });

    test('Should return 403 upon trying to update an answer without being authenticated', async () => {
      const userAndQuestion = await insertUserAndQuestion();
      // details.user.dataValues;
      // details.question.dataValues;
      const userAndAnswer = await insertUserAndAnswer(userAndQuestion.question.dataValues.id);

      const res = await request(app)
        .patch(`/v1/api/questions/${userAndAnswer.answer.dataValues.id}`)
        .set('Accept', 'application/json')
        .send(answer)
        .expect(httpStatus.UNAUTHORIZED);

      expect(res.body.message).toBe('Please authenticate');
    });
  });

  describe('DELETE /v1/api/answers/id', () => {
    test.skip('Should return 200 upon trying to delete a question', async () => {
      const userAndQuestion = await insertUserAndQuestion();
    
      const userAndAnswer = await insertUserAndAnswer(userAndQuestion.question.dataValues.id);

      const newUserAccessToken = await customAccessToken(userAndAnswer.user.dataValues.id);

      const res = await request(app)
        .delete(`/v1/api/answers/${userAndAnswer.answer.dataValues.id}`)
        .auth(newUserAccessToken, { type: 'bearer' });

      expect(res.body.success).toBe('Deleted');
    });

    test.skip('Should return 403 upon trying to delete a question without being the owner', async () => {
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

    test.skip('Should return 403 upon trying to delete a question without an access token', async () => {
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
