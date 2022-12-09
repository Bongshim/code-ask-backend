const express = require('express');
const validate = require('../middleware/validate');
const answerValidation = require('../validations').answerValidation;
const answerController = require('../controllers').answerController;
const { auth } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(answerValidation.createAnswer), answerController.createAnswer)
  .get(auth(), answerController.getAnswers);

router
  .route('/:answerId')
  .get(auth(), validate(answerValidation.getAnswer), answerController.getAnswer)
  .patch(auth(), validate(answerValidation.updateAnswer), answerController.updateAnswer)
  .delete(auth(), validate(answerValidation.deleteAnswer), answerController.deleteAnswer);

router.route('/:answerId/upvote').patch(auth(), validate(answerValidation.upvoteAnswer), answerController.upvoteAnswer);
router.route('/:answerId/downvote').patch(auth(), validate(answerValidation.downvoteAnswer), answerController.downvoteAnswer);
router.route('/:answerId/accepted').patch(auth(), validate(answerValidation.acceptedAnswer), answerController.acceptAnswer);

router.route('/user/:userId').get(auth(), answerController.getAnswersByUser);
module.exports = router;
