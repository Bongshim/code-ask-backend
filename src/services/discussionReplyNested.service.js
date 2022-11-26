const { Discussion_Reply_Nested } = require('../models/Discussion_reply_nested');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');
const { getUserById } = require('./user.service');

/**
 * Create discussionReply
 * @param {string} userId
 * @param {Object} discussionReplyNestedBody
 * @return {promise<DiscussionReply>}
 */
const createDiscussionReplyNested = async (userId, discussionReplyNestedBody) => {
  discussionReplyNestedBody['UserId'] = userId;
  return await Discussion_Reply_Nested.create(discussionReplyNestedBody);
};

/**
 * Get all discussionReplys
 * @returns {Promise<DiscussionReplies>}
 */
const getDiscussionRepliesNested = async () => {
  return await Discussion_Reply_Nested.findAll();
};

/**
 * Get discussionReply by id
 * @param {ObjectId} discussionReplyNestedId
 * @returns {Promise<discussionReply>}
 */
const getDiscussionReplyNestedById = async (discussionReplyNestedId) => {
  logger.info(discussionReplyNestedId);
  const discussionReply = await Discussion_Reply_Nested.findByPk(discussionReplyNestedId);
  if (!discussionReply) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Reply not found');
  }
  return discussionReply;
};

/**
 * Update discussionReply by id
 * @param {ObjectId} discussionReplyNestedId
 * @param {Object} discussionReplyNestedBody
 * @returns {Promise<discussionReply>}
 */
const updatedDiscussionReplyNestedById = async (discussionReplyNestedId, discussionReplyNestedBody, userId) => {
  const discussionReply = await Discussion_Reply_Nested.findByPk(discussionReplyNestedId);
  if (!discussionReply) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Reply not found');
  }
  const { role } = await getUserById(userId);

  if (discussionReply.UserId === userId || role === 'admin') {
    Object.assign(discussionReply, discussionReplyNestedBody);
    return await Discussion_Reply_Nested.update(discussionReply.dataValues, { where: { id: discussionReplyNestedId } });
  }
  throw new ApiError(httpStatus.UNAUTHORIZED, 'Cannot edit');
};

/**
 * Delete discussionReply by id
 * @param {ObjectId} discussionReplyNestedId
 * @returns {Promise<discussionReply>}
 */
const deletedDiscussionReplyNestedById = async (discussionReplyNestedId, userId) => {
  logger.info(discussionReplyNestedId);
  const discussionReply = await Discussion_Reply_Nested.findByPk(discussionReplyNestedId);
  if (!discussionReply) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Reply not found');
  }
  const { role } = await getUserById(userId);

  if (discussionReply.UserId === userId || role === 'admin') {
    return await Discussion_Reply_Nested.destroy({ where: { id: discussionReplyNestedId } });
  }
  throw new ApiError(httpStatus.UNAUTHORIZED, 'Cannot delete');
};

module.exports = {
  createDiscussionReplyNested,
  getDiscussionRepliesNested,
  getDiscussionReplyNestedById,
  updatedDiscussionReplyNestedById,
  deletedDiscussionReplyNestedById,
};
