const { questionCommentService } = require('../services');
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const logger = require('../config/logger');

const createComment = catchAsync(async (req, res) => {
  logger.info(req.query.questionId);
  const userId = req.userId;
  const questionId = req.query.questionId
  const comment = await questionCommentService.createComment(userId, questionId, req.body);
  res.status(httpStatus.CREATED).json(comment);
});



module.exports = {
  createComment,
};
