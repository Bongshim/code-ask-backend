const express = require('express');
const validate = require('../middleware/validate');
const questionValidation = require('../validations').questionValidation;
const questionController = require('../controllers').questionController;
const { auth } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(questionValidation.createQuestion), questionController.createQuestion)
  .get(questionController.getQuestions);

router.route('/answered').get(questionController.getAnsweredQuestions);

router.route('/unanswered').get(questionController.getUnansweredQuestions);

router
.route('/:questionId')
.get(auth(), validate(questionValidation.getQuestion), questionController.getQuestionById)
.patch(auth(), validate(questionValidation.updateQuestion), questionController.updateQuestion)
.delete(auth(), validate(questionValidation.deleteQuestion), questionController.deleteQuestionById);

router.route('/user/:userId').get(auth(), questionController.getQuestionsByUser);
module.exports = router;
