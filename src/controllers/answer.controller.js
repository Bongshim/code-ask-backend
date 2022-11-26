const { answerService } = require('../services');
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const logger = require('../config/logger');

const createAnswer = catchAsync(async (req, res) => {
  logger.info(req.userId);
  const answer = await answerService.createAnswer(req.userId, req.body);
  res.status(httpStatus.CREATED).json(answer);
});

const getAnswers = catchAsync(async (req, res) => {
  const answers = await answerService.getAnswers();
  res.status(httpStatus.OK).json(answers);
});

const getAnswer = catchAsync(async (req, res) => {
  const answer = await answerService.getAnswerById(req.params.answerId);
  res.status(httpStatus.OK).json(answer);
});

const updateAnswer = catchAsync(async (req, res) => {
  await answerService.updateAnswerById(req.params.answerId, req.body, req.userId);
  res.status(httpStatus.OK).json({ success: 'Updated' });
});

const upvoteAnswer = catchAsync(async (req, res) => {
  await answerService.upvoteAnswer(req.params.answerId, req.userId);
  res.status(httpStatus.OK).json({ success: 'Upvoted' });
});

const downvoteAnswer = catchAsync(async (req, res) => {
  await answerService.downvoteAnswer(req.params.answerId, req.userId);
  res.status(httpStatus.OK).json({ success: 'Downvoted' });
});

const acceptAnswer = catchAsync(async (req, res) => {
  await answerService.acceptAnswer(req.params.answerId);
  res.status(httpStatus.OK).json({ success: 'Done' });
});

const deleteAnswer = catchAsync(async (req, res) => {
  await answerService.deleteAnswerById(req.params.answerId);
  res.status(httpStatus.OK).json({ success: 'Deleted' });
});

module.exports = {
  createAnswer,
  getAnswers,
  getAnswer,
  updateAnswer,
  deleteAnswer,
  upvoteAnswer,
  downvoteAnswer,
  acceptAnswer,
};
