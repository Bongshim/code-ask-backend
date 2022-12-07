const { Question } = require('../models/Question');
const { Tag } = require('../models/Tag');
const { User } = require('../models/User');
const { Answer } = require('../models/Answer');
const { Comment } = require('../models/Comment');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const Sequelize = require('sequelize');
const { getAbsentValues } = require('../utils/arraySorter');
const { getUserById } = require('./user.service');
const logger = require('../config/logger');

/**
 * Create question
 * @param {string} questionId
 * @return {promise<Question>}
 */
const findOneQuestionWithTags = async (questionId) => {
  return await Question.findOne({
    where: { id: questionId },
  });
};

/**
 * Create question
 * @param {string} userId
 * @param {Object} questionBody
 * @return {promise<Question>}
 */
const createQuestion = async (userId, questionBody) => {
  questionBody['UserId'] = userId;
  const { UserId, title, body, tags } = questionBody;
  const question = await Question.create({ title, body, UserId });

  tags.map(async (qTag) => {
    const [tag, created] = await Tag.findOrCreate({
      where: { name: qTag.name },
    });
    await question.addTag(tag, { through: { selfGranted: false } });
  });

  return await findOneQuestionWithTags(question.dataValues.id);
};

/**
 * Get all questions
 * @returns {Promise<Question>}
 */
const getQuestions = async () => {
  return await Question.findAll({
    include: [
      { model: User, attributes: ['profile_image', 'username'] },
      { model: Tag, attributes: ['id', 'name'], through: { attributes: [] } },
      { model: Comment, attributes: ['id', 'comment', 'UserId'], through: { attributes: [] } },
      {
        model: Answer,
        attributes: ['id', 'content', 'upvotes', 'downvotes', 'accepted', 'UserId', 'QuestionId'],
        include: [{ model: Comment, attributes: ['id', 'comment', 'UserId'], through: { attributes: [] } }],
      },
    ],
    order: [['createdAt', 'DESC']],
  });
};

/**
 * Get all questions asked by user
 * @returns {Promise<Question>}
 */
const getQuestionsByUser = async (userId) => {
  const user = await getUserById(userId);

  return await Question.findAll({
    where: { UserId: user.id },
    include: [
      { model: User, attributes: ['profile_image', 'username'] },
      { model: Tag, attributes: ['id', 'name'], through: { attributes: [] } },
      { model: Comment, attributes: ['id', 'comment', 'UserId'], through: { attributes: [] } },
      {
        model: Answer,
        attributes: ['id', 'content', 'upvotes', 'downvotes', 'accepted', 'UserId', 'QuestionId'],
        include: [{ model: Comment, attributes: ['id', 'comment', 'UserId'], through: { attributes: [] } }],
      },
    ],
    order: [['createdAt', 'DESC']],
  });
};

/**
 * Get all questions
 * @returns {Promise<Question>}
 */
const getAnsweredQuestions = async () => {
  return await Question.findAll({
    include: [
      { model: User, attributes: ['profile_image', 'username'] },
      { model: Tag, attributes: ['id', 'name'], through: { attributes: [] } },
      { model: Comment, attributes: ['id', 'comment', 'UserId'], through: { attributes: [] } },
      {
        model: Answer,
        required: true,
        attributes: ['id', 'content', 'upvotes', 'downvotes', 'accepted', 'UserId', 'QuestionId'],
        include: [{ model: Comment, attributes: ['id', 'comment', 'UserId'], through: { attributes: [] } }],
      },
    ],
  });
};

/**
 * Get all questions
 * @returns {Promise<Question>}
 */
const getUnansweredQuestions = async () => {
  return await Question.findAll({
    include: [
      { model: User, attributes: ['profile_image', 'username'] },
      { model: User, attributes: ['profile_image', 'username'] },
      { model: Tag, attributes: ['id', 'name'], through: { attributes: [] } },
      { model: Comment, attributes: ['id', 'comment', 'UserId'], through: { attributes: [] } },
      {
        model: Answer,
        required: false,
        attributes: [],
      },
    ],
    where: Sequelize.where(Sequelize.col('Answers.QuestionId'), 'IS', null),
  });
};

/**
 * Get questions by id
 * @param {ObjectId} questionsId
 * @returns {Promise<Question>}
 */
const getQuestionById = async (questionId) => {
  const question = await Question.findOne({
    where: { id: questionId },
    include: [
      { model: User, attributes: ['profile_image', 'username'] },
      { model: Tag, attributes: ['id', 'name'], through: { attributes: [] } },
      { model: Comment, attributes: ['id', 'comment', 'UserId'], through: { attributes: [] } },
      {
        model: Answer,
        attributes: ['id', 'content', 'upvotes', 'downvotes', 'accepted', 'UserId', 'QuestionId'],
        include: [
          { model: User, attributes: ['profile_image', 'username'] },
          {
            model: Comment,
            attributes: ['id', 'comment', 'UserId'],
            through: { attributes: [] },
            include: [{ model: User, attributes: ['profile_image', 'username'] }],
          },
        ],
      },
    ],
  });
  if (!question) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Question not found');
  }
  return question;
};

/**
 * Update question by id
 * @param {ObjectId} questionId
 * @param {Object} questionBody
 * @returns {Promise<Answer>}
 */
const updateQuestionById = async (questionId, questionBody, userId) => {
  const question = await Question.findByPk(questionId);
  if (!question) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Question not found');
  }
  const { role } = await getUserById(userId);

  if (question.UserId === userId || role === 'admin') {
    const { title, body, tags } = questionBody;
    const ownTags = await question.getTags({
      attributes: ['name'],
      joinTableAttributes: [],
    });

    const existingTag = [];
    ownTags.map((tag) => {
      const { name } = tag;
      existingTag.push(name);
    });

    const currentTag = [];
    tags.map((tag) => {
      const { name } = tag;
      currentTag.push(name);
    });

    // compare for update and delete
    const toCreate = getAbsentValues(currentTag, existingTag);
    const toDelete = getAbsentValues(existingTag, currentTag);

    if (toCreate.length > 0) {
      toCreate.forEach(async (tagC) => {
        const [tag, created] = await Tag.findOrCreate({ where: { name: tagC } });
        await question.addTag(tag, { through: { selfGranted: false } });
      });
    }

    if (toDelete.length > 0) {
      toDelete.forEach(async (tag) => {
        const deletedTag = await Tag.findOne({ where: { name: tag } });
        question.removeTag(deletedTag);
      });
    }
    await Question.update({ title, body }, { where: { id: questionId } });

    return { toCreate, toDelete };
  }

  throw new ApiError(httpStatus.UNAUTHORIZED, 'Cannot Edit');
};

/**
 * Delete question by id
 * @param {ObjectId} questionId
 * @returns {Promise<Question>}
 */
const deleteQuestionById = async (questionId, userId) => {
  const question = await Question.findByPk(questionId);
  if (!question) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Question not found');
  }

  const { role } = await getUserById(userId);

  if (question.UserId === userId || role === 'admin') {
    return await Question.destroy({ where: { id: questionId } });
  }

  throw new ApiError(httpStatus.UNAUTHORIZED, 'Cannot Delete');
};

module.exports = {
  createQuestion,
  getQuestions,
  getQuestionById,
  getAnsweredQuestions,
  deleteQuestionById,
  getUnansweredQuestions,
  updateQuestionById,
  getQuestionsByUser,
};
