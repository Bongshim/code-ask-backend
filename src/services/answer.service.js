const { Answer } = require('../models/Answer');
const { Question } = require('../models/Question');
const { Downvote } = require('../models/User_downvotes');
const { User } = require('../models/User');
const { Upvote } = require('../models/User_upvote');
const { Comment } = require('../models/Comment');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');
const { getUserById } = require('./user.service');

/**
 * Create answer
 * @param {string} userId
 * @param {Object} answerBody
 * @return {promise<Answer>}
 */
const createAnswer = async (userId, answerBody) => {
  answerBody['UserId'] = userId;

  const question = await Question.findByPk(answerBody.QuestionId);
  if (!question) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Question does not exist');
  }

  return await Answer.create(answerBody);
};

/**
 * Get all answers
 * @returns {Promise<answers>}
 */
const getAnswers = async () => {
  const answers = await Answer.findAll({
    include: [{ model: Comment, attributes: ['id', 'comment', 'UserId'], through: { attributes: [] } }],
  });
  return answers;
};

/**
 * Get answer by id
 * @param {ObjectId} answerId
 * @returns {Promise<Answer>}
 */
const getAnswerById = async (answerId) => {
  const answer = await Answer.findByPk(answerId);
  if (!answer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Answer not found');
  }
  return answer;
};

/**
 * Get all answers asked by user
 * @returns {Promise<Answers>}
 */
const getAnswersByUser = async (userId) => {
  const user = await getUserById(userId);

  return await Answer.findAll({
    where: { UserId: user.id },
    include: [
      { model: User, attributes: ['profile_image', 'username'] },
      { model: Comment, attributes: ['id', 'comment', 'UserId'], through: { attributes: [] } },
    ],
    order: [['createdAt', 'DESC']],
  });
};

/**
 * Update answer by id
 * @param {ObjectId} answerId
 * @param {Object} answerBody
 * @returns {Promise<Answer>}
 */
const updateAnswerById = async (answerId, answerBody, userId) => {
  const answer = await Answer.findByPk(answerId);
  if (!answer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Answer not found');
  }

  const { role } = await getUserById(userId);

  if (answer.UserId === userId || role === 'admin') {
    Object.assign(answer, answerBody);
    return await Answer.update(answer.dataValues, { where: { id: answerId } });
  }
  throw new ApiError(httpStatus.UNAUTHORIZED, 'Cannot edit');
};

/**
 * Upvote answer
 * @param {ObjectId} answerId
 * @returns {Promise<Answer>}
 */
const upvoteAnswer = async (answerId, userId) => {
  const answer = await Answer.findByPk(answerId);
  if (!answer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Answer not found');
  }

  const voteExists = await Upvote.findOne({ where: { AnswerId: answerId, UserId: userId } });
  if (voteExists) {
    await Upvote.destroy({ where: { UserId: userId, AnswerId: answerId }, force: true });
    return await answer.decrement('upvotes');
  }

  await Upvote.create({ UserId: userId, AnswerId: answerId });

  return await answer.increment('upvotes');
};

/**
 * Downvote answer
 * @param {ObjectId} answerId
 * @returns {Promise<Answer>}
 */
const downvoteAnswer = async (answerId, userId) => {
  const answer = await Answer.findByPk(answerId);
  if (!answer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Answer not found');
  }

  const voteExists = await Downvote.findOne({ where: { AnswerId: answerId, UserId: userId } });
  if (voteExists) {
    await Downvote.destroy({ where: { UserId: userId, AnswerId: answerId }, force: true });
    return await answer.decrement('downvotes');
  }

  await Downvote.create({ UserId: userId, AnswerId: answerId });

  return await answer.increment('downvotes');
};

/**
 * Accept answer
 * @param {ObjectId} answerId
 * @returns {Promise<Answer>}
 */
const acceptAnswer = async (answerId, userId) => {
  const answer = await Answer.findByPk(answerId);
  if (!answer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Answer not found');
  }
  return answer.accepted == false
    ? await updateAnswerById(answerId, { accepted: true }, userId)
    : await updateAnswerById(answerId, { accepted: false }, userId);
};

/**
 * Delete answer by id
 * @param {ObjectId} answerId
 * @returns {Promise<Answer>}
 */
const deleteAnswerById = async (answerId, userId) => {
  logger.info(answerId);
  const answer = await Answer.findByPk(answerId);
  if (!answer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Answer not found');
  }

  const { role } = await getUserById(userId);

  if (answer.UserId === userId || role === 'admin') {
    return await Answer.destroy({ where: { id: answerId } });
  }
  throw new ApiError(httpStatus.UNAUTHORIZED, 'Cannot delete');
};

module.exports = {
  createAnswer,
  getAnswers,
  upvoteAnswer,
  acceptAnswer,
  downvoteAnswer,
  getAnswerById,
  updateAnswerById,
  getAnswersByUser,
  deleteAnswerById,
};
