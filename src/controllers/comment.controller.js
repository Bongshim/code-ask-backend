const { commentService } = require('../services');
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const logger = require('../config/logger');



const getComments = catchAsync(async (req, res) => {
  const comments = await commentService.getComments();
  res.status(httpStatus.OK).json(comments);
});

const getComment = catchAsync(async (req, res) => {
  const comment = await commentService.getCommentById(req.params.commentId);
  res.status(httpStatus.OK).json(comment);
});

const updateComment = catchAsync(async (req, res) => {
  
  await commentService.updateCommentById(req.params.commentId, req.body, req.userId);
  res.status(httpStatus.OK).json({ success: 'Updated' });
});

const deleteComment = catchAsync(async (req, res) => {
  await commentService.deleteCommentById(req.params.commentId, req.userId);
  res.status(httpStatus.OK).json({ success: 'Deleted' });
});

module.exports = {
  
  getComments,
  getComment,
  updateComment,
  deleteComment,
};
