const { discussionService } = require('../services');
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const logger = require('../config/logger');

const createDiscussion = catchAsync(async (req, res) => {
  const discussion = await discussionService.createDiscussion(req.userId, req.body);
  res.status(httpStatus.CREATED).json(discussion);
});

const getDiscussions = catchAsync(async (req, res) => {
  const discussions = await discussionService.getDiscussions();
  res.status(httpStatus.OK).json(discussions);
});

const getDiscussion = catchAsync(async (req, res) => {
  const discussion = await discussionService.getDiscussionById(req.params.discussionId);
  res.status(httpStatus.OK).json(discussion);
});

const updateDiscussion = catchAsync(async (req, res) => {
  await discussionService.updateDiscussionById(req.params.discussionId, req.body);
  res.status(httpStatus.OK).json({ success: 'Updated' });
});

const deleteDiscussion = catchAsync(async (req, res) => {
  await discussionService.deleteDiscussionById(req.params.discussionId);
  res.status(httpStatus.OK).json({ success: 'Deleted' });
});

module.exports = {
  createDiscussion,
  getDiscussions,
  getDiscussion,
  updateDiscussion,
  deleteDiscussion,
};
