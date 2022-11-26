const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { searchStackOverflow } = require('./stackoverflow.service');
const { Question } = require('../models/Question');
const { User } = require('../models/User');
const { Tag } = require('../models/Tag');
const { Op } = require('sequelize');

/**
 * Search question model
 * @param {string} searchQuery
 * @return {promise<results>}
 */
const findQuestions = async (searchQuery) => {
  return await Question.findAll({
    include: [
      { model: User, attributes: ['profile_image', 'username'] },
      { model: Tag, attributes: ['id', 'name'], through: { attributes: [] } },
    ],
    order: [['createdAt', 'DESC']],
    where: {
      [Op.or]: [{ title: { [Op.like]: '%' + searchQuery + '%' } }, { body: { [Op.like]: '%' + searchQuery + '%' } }],
    },
  });
};

/**
 * Search question
 * @param {string} searchQuery
 * @return {promise<results>}
 */
const search = async (searchQuery) => {
  const questions = await findQuestions(searchQuery);

  if (questions.length === 0) {
    return await searchStackOverflow(searchQuery);
  }
  return questions;
};

module.exports = { search };
