const { questionService } = require('../services');
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const logger = require('../config/logger');

const createQuestion = catchAsync(async (req, res) => {
  logger.info(req.userId);
  const userId = req.userId;
  const question = await questionService.createQuestion(userId, req.body);
  res.status(httpStatus.CREATED).json(question);
});

const updateQuestion = catchAsync(async (req, res) => {
 await questionService.updateQuestionById(req.params.questionId, req.body, req.userId);
  res.status(httpStatus.OK).json({ success: 'Updated' });
});

const getQuestions = catchAsync(async (req, res) => {
  const questions = await questionService.getQuestions();
  res.status(httpStatus.OK).json(questions);
});

const getQuestionsByUser = catchAsync(async (req, res) => {
  const questions = await questionService.getQuestionsByUser(req.params.userId);
  res.status(httpStatus.OK).json(questions);
});

const getAnsweredQuestions = catchAsync(async (req, res) => {
  const questions = await questionService.getAnsweredQuestions();
  res.status(httpStatus.OK).json(questions);
});

const getUnansweredQuestions = catchAsync(async (req, res) => {
  logger.info('looking for unanswerred');
  const questions = await questionService.getUnansweredQuestions();
  res.status(httpStatus.OK).json(questions);
});

const getQuestionById = catchAsync(async (req, res) => {
  const question = await questionService.getQuestionById(req.params.questionId);
  res.status(httpStatus.OK).json(question);
});

const deleteQuestionById = catchAsync(async (req, res) => {
  const question = await questionService.deleteQuestionById(req.params.questionId, req.userId);
  res.status(httpStatus.OK).json({ success: 'Deleted' });
});

module.exports = {
  createQuestion,
  getQuestions,
  getQuestionById,
  getAnsweredQuestions,
  deleteQuestionById,
  getUnansweredQuestions,
  getQuestionsByUser,
  updateQuestion,
};
