const { Discussion_Reply } = require('../models/Discussion_reply');
const { Discussion_Reply_Nested } = require('../models/Discussion_reply_nested');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');
const { getUserById } = require('./user.service');

/**
 * Create discussionReply
 * @param {string} userId
 * @param {Object} discussionReplyBody
 * @return {promise<DiscussionReply>}
 */
const createDiscussionReply = async (userId, discussionReplyBody) => {
  discussionReplyBody['UserId'] = userId;
  return await Discussion_Reply.create(discussionReplyBody);
};

/**
 * Get all discussionReplys
 * @returns {Promise<DiscussionReplies>}
 */
const getDiscussionReplies = async () => {
  return await Discussion_Reply.findAll({
    include: [{ model: Discussion_Reply_Nested, attributes: ['id', 'content', 'UserId'] }],
  });
};

/**
 * Get discussionReply by id
 * @param {ObjectId} discussionReplyId
 * @returns {Promise<discussionReply>}
 */
const getDiscussionReplyById = async (discussionReplyId) => {
  const discussionReply = await Discussion_Reply.findByPk(discussionReplyId, {
    include: [{ model: Discussion_Reply_Nested, attributes: ['id', 'content', 'UserId'] }],
  });
  if (!discussionReply) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Reply not found');
  }
  return discussionReply;
};

/**
 * Update discussionReply by id
 * @param {ObjectId} discussionReplyId
 * @param {Object} discussionReplyBody
 * @returns {Promise<discussionReply>}
 */
const updatedDiscussionReplyById = async (discussionReplyId, discussionReplyBody, userId) => {
  const discussionReply = await Discussion_Reply.findByPk(discussionReplyId);
  if (!discussionReply) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Reply not found');
  }
  const { role } = await getUserById(userId);

  if (discussionReply.UserId === userId || role === 'admin') {
    Object.assign(discussionReply, discussionReplyBody);
    return await Discussion_Reply.update(discussionReply.dataValues, { where: { id: discussionReplyId } });
  }
  throw new ApiError(httpStatus.UNAUTHORIZED, 'Cannot edit');
};

/**
 * Delete discussionReply by id
 * @param {ObjectId} discussionReplyId
 * @returns {Promise<discussionReply>}
 */
const deletedDiscussionReplyById = async (discussionReplyId, userId) => {
  logger.info(discussionReplyId);
  const discussionReply = await Discussion_Reply.findByPk(discussionReplyId);
  if (!discussionReply) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Reply not found');
  }

  const { role } = await getUserById(userId);

  if (discussionReply.UserId === userId || role === 'admin') {
    return await Discussion_Reply.destroy({ where: { id: discussionReplyId } });
  }
  throw new ApiError(httpStatus.UNAUTHORIZED, 'Cannot delete');
};

module.exports = {
  createDiscussionReply,
  getDiscussionReplies,
  getDiscussionReplyById,
  updatedDiscussionReplyById,
  deletedDiscussionReplyById,
};
