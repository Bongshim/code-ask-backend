const express = require('express');
const validate = require('../middleware/validate');
const discussionReplyNestedValidation = require('../validations').discussionReplyNestedValidation;
const discussionReplyNestedController = require('../controllers').discussionReplyNestedController;
const { auth } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(discussionReplyNestedValidation.createReply), discussionReplyNestedController.createDiscussionReplyNested)
  .get(auth(), discussionReplyNestedController.getDiscussionRepliesNested);

router
  .route('/:discussionReplyNestedId')
  .get(auth(), validate(discussionReplyNestedValidation.getReply), discussionReplyNestedController.getDiscussionReplyNested)
  .patch(auth(), validate(discussionReplyNestedValidation.updateReply), discussionReplyNestedController.updateDiscussionReplyNested)
  .delete(auth(), validate(discussionReplyNestedValidation.deleteReply), discussionReplyNestedController.deleteDiscussionReplyNested);

module.exports = router;
