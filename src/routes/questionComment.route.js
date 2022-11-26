const express = require('express');
const validate = require('../middleware/validate');
const commentValidation = require('../validations').commentValidation;
const questionCommentController = require('../controllers').questionCommentController;
const { auth } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(commentValidation.createQuestionComment), questionCommentController.createComment);

module.exports = router;
