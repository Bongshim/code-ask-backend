const { Comment } = require('../models/Comment');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');
const { getUserById } = require('./user.service');

/**
 * Get all comments
 * @returns {Promise<comments>}
 */
const getComments = async () => {
  return await Comment.findAll();
};

/**
 * Get comment by id
 * @param {ObjectId} commentId
 * @returns {Promise<comment>}
 */
const getCommentById = async (commentId) => {
  const comment = await Comment.findByPk(commentId);
  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'comment not found');
  }
  return comment;
};

/**
 * Update comment by id
 * @param {ObjectId} commentId
 * @param {Object} commentBody
 * @returns {Promise<comment>}
 */
const updateCommentById = async (commentId, commentBody, userId) => {
  const comment = await Comment.findByPk(commentId);
  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'comment not found');
  }
  const { role } = await getUserById(userId);

  if (comment.UserId === userId || role === 'admin') {
    Object.assign(comment, commentBody);
    return await Comment.update(comment.dataValues, { where: { id: commentId } });
  }
  throw new ApiError(httpStatus.UNAUTHORIZED, 'Cannot Edit');
};

/**
 * Delete comment by id
 * @param {ObjectId} commentId
 * @returns {Promise<comment>}
 */
const deleteCommentById = async (commentId, userId) => {
  logger.info(commentId);
  const comment = await Comment.findByPk(commentId);
  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'comment not found');
  }

  const { role } = await getUserById(userId);
  if (comment.UserId === userId || role === 'admin') {
    return await Comment.destroy({ where: { id: commentId } });
  }
  throw new ApiError(httpStatus.UNAUTHORIZED, 'Cannot Delete');
};

module.exports = {
  getComments,
  getCommentById,
  updateCommentById,
  deleteCommentById,
};
