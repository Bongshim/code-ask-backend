const { Discussion } = require('../models/Discussion');
const { Discussion_Reply } = require('../models/Discussion_reply');
const { Discussion_Reply_Nested } = require('../models/Discussion_reply_nested');
const { User } = require('../models/User');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

/**
 * Create discussion
 * @param {string} userId
 * @param {Object} discussionBody
 * @return {promise<Discussion>}
 */
const createDiscussion = async (userId, discussionBody) => {
  discussionBody['UserId'] = userId;
  return await Discussion.create(discussionBody);
};

/**
 * Get all discussions
 * @returns {Promise<discussions>}
 */
const getDiscussions = async () => {
  const discussions = await Discussion.findAll({
    include: [
      { model: User, attributes: ['profile_image', 'username'] },
      {
        model: Discussion_Reply,
        attributes: ['id', 'content', 'UserId'],
        include: [{ model: Discussion_Reply_Nested, attributes: ['id', 'content', 'UserId'] }],
      },
    ],
    order: [['createdAt', 'DESC']],
  });
  return discussions;
};

/**
 * Get discussion by id
 * @param {ObjectId} discussionId
 * @returns {Promise<Discussion>}
 */
 const getDiscussionById = async (discussionId) => {
  const discussion = await Discussion.findByPk(discussionId, {
    include: [
      { model: User, attributes: ['profile_image', 'username'] },
      {
        model: Discussion_Reply,
        include: [
          { model: Discussion_Reply_Nested, include: [{ model: User, attributes: ['profile_image', 'username'] }] },
          { model: User, attributes: ['profile_image', 'username'] },
        ],
      },
    ],
  });

  if (!discussion) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Discussion not found');
  }
  return discussion;
};

/**
 * Update discussion by id
 * @param {ObjectId} discussionId
 * @param {Object} discussionBody
 * @returns {Promise<Discussion>}
 */
const updateDiscussionById = async (discussionId, discussionBody) => {
  const discussion = await Discussion.findByPk(discussionId);
  if (!discussion) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Discussion not found');
  }
  Object.assign(discussion, discussionBody);
  return await Discussion.update(discussion.dataValues, { where: { id: discussionId } });
};

/**
 * Delete discussion by id
 * @param {ObjectId} discussionId
 * @returns {Promise<Discussion>}
 */
const deleteDiscussionById = async (discussionId) => {
  logger.info(discussionId);
  const discussion = await Discussion.findByPk(discussionId);
  if (!discussion) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Discussion not found');
  }
  return await Discussion.destroy({ where: { id: discussionId } });
};

module.exports = {
  createDiscussion,
  getDiscussions,
  getDiscussionById,
  updateDiscussionById,
  deleteDiscussionById,
};
