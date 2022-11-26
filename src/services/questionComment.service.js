const { Comment } = require('../models/Comment');
const { Question } = require('../models/Question');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

/**
 * Create comment
 * @param {string} userId
 * @param {Object} commentBody
 * @return {promise<Comment>}
 */
const createComment = async (userId, questionId, commentBody) => {
  const question = await Question.findOne({ where: { id: questionId } });
  commentBody['UserId'] = userId;
  const comment = await Comment.create(commentBody);
  await question.addComment(comment, { through: { selfGranted: false } });

  return comment;
};


module.exports = {
  createComment,
  
};
