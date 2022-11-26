const express = require('express');
const validate = require('../middleware/validate');
const commentValidation = require('../validations').commentValidation;
const CommentController = require('../controllers').commentController;
const { auth } = require('../middleware/auth');

const router = express.Router();

router.route('/').get(auth(), CommentController.getComments);

router
  .route('/:commentId')
  .get(auth(), validate(commentValidation.getComment), CommentController.getComment)
  .patch(auth(), validate(commentValidation.updateComment), CommentController.updateComment)
  .delete(auth(), validate(commentValidation.deleteComment), CommentController.deleteComment);

module.exports = router;
