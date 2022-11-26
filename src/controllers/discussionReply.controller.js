const { discussionReplyService } = require('../services');
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const logger = require('../config/logger');

const createDiscussionReply = catchAsync(async (req, res) => {
  logger.info(req.userId);
  const discussionReply = await discussionReplyService.createDiscussionReply(req.userId, req.body);
  res.status(httpStatus.CREATED).json(discussionReply);
});

const getDiscussionReplies = catchAsync(async (req, res) => {
  const discussionReplies = await discussionReplyService.getDiscussionReplies();
  res.status(httpStatus.OK).json(discussionReplies);
});

const getDiscussionReply = catchAsync(async (req, res) => {
  const discussionReply = await discussionReplyService.getDiscussionReplyById(req.params.discussionReplyId);
  res.status(httpStatus.OK).json(discussionReply);
});

const updateDiscussionReply = catchAsync(async (req, res) => {
  await discussionReplyService.updatedDiscussionReplyById(req.params.discussionReplyId, req.body, req.userId);
  res.status(httpStatus.OK).json({ success: 'Updated' });
});

const deleteDiscussionReply = catchAsync(async (req, res) => {
  await discussionReplyService.deletedDiscussionReplyById(req.params.discussionReplyId, req.userId);
  res.status(httpStatus.OK).json({ success: 'Deleted' });
});

module.exports = {
  createDiscussionReply,
  getDiscussionReplies,
  getDiscussionReply,
  updateDiscussionReply,
  deleteDiscussionReply,
};
