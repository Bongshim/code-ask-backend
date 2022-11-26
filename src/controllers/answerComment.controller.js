const { answerCommentService } = require('../services');
const { commentService } = require('../services');
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const logger = require('../config/logger');

const createComment = catchAsync(async (req, res) => {
  logger.info(req.query.answerId);
  const userId = req.userId;
  const answerId = req.query.answerId
  const comment = await answerCommentService.createComment(userId, answerId, req.body);
  res.status(httpStatus.CREATED).json(comment);
});


module.exports = {
  createComment,
  
};
