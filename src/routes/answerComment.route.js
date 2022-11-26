const express = require('express');
const validate = require('../middleware/validate');
const commentValidation = require('../validations').commentValidation;
const answerCommentController = require('../controllers').answerCommentController;
const { auth } = require('../middleware/auth');

const router = express.Router();

router.route('/').post(auth(), validate(commentValidation.createAnswerComment), answerCommentController.createComment);

module.exports = router;
