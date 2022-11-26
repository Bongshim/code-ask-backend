const { discussionReplyNestedService } = require('../services');
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const logger = require('../config/logger');

const createDiscussionReplyNested = catchAsync(async (req, res) => {
  logger.info(req.userId);
  const discussionReply = await discussionReplyNestedService.createDiscussionReplyNested(req.userId, req.body);
  res.status(httpStatus.CREATED).json(discussionReply);
});

const getDiscussionRepliesNested = catchAsync(async (req, res) => {
  const discussionReplies = await discussionReplyNestedService.getDiscussionRepliesNested();
  res.status(httpStatus.OK).json(discussionReplies);
});

const getDiscussionReplyNested = catchAsync(async (req, res) => {
  const discussionReply = await discussionReplyNestedService.getDiscussionReplyNestedById(
    req.params.discussionReplyNestedId
  );
  res.status(httpStatus.OK).json(discussionReply);
});

const updateDiscussionReplyNested = catchAsync(async (req, res) => {
  await discussionReplyNestedService.updatedDiscussionReplyNestedById(
    req.params.discussionReplyNestedId,
    req.body,
    req.userId
  );
  res.status(httpStatus.OK).json({ success: 'Updated' });
});

const deleteDiscussionReplyNested = catchAsync(async (req, res) => {
  await discussionReplyNestedService.deletedDiscussionReplyNestedById(req.params.discussionReplyNestedId, req.userId);
  res.status(httpStatus.OK).json({ success: 'Deleted' });
});

module.exports = {
  createDiscussionReplyNested,
  getDiscussionRepliesNested,
  getDiscussionReplyNested,
  updateDiscussionReplyNested,
  deleteDiscussionReplyNested,
};
