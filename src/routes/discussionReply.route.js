const express = require('express');
const validate = require('../middleware/validate');
const discussionReplyValidation = require('../validations').discussionReplyValidation;
const discussionReplyController = require('../controllers').discussionReplyController;
const { auth } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(discussionReplyValidation.createReply), discussionReplyController.createDiscussionReply)
  .get(auth(), discussionReplyController.getDiscussionReplies);

router
  .route('/:discussionReplyId')
  .get(auth(), validate(discussionReplyValidation.getReply), discussionReplyController.getDiscussionReply)
  .patch(auth(), validate(discussionReplyValidation.updateReply), discussionReplyController.updateDiscussionReply)
  .delete(auth(), validate(discussionReplyValidation.deleteReply), discussionReplyController.deleteDiscussionReply);

module.exports = router;
