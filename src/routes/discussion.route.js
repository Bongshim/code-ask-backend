const express = require('express');
const validate = require('../middleware/validate');
const discussionValidation = require('../validations').discussionValidation;
const discussionController = require('../controllers').discussionController;
const { auth } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .post(auth("manageDiscussions"), validate(discussionValidation.createDiscussion), discussionController.createDiscussion)
  .get(auth("getDiscussions"), discussionController.getDiscussions);

router
  .route('/:discussionId')
  .get(auth("getDiscussions"), validate(discussionValidation.getDiscussion), discussionController.getDiscussion)
  .patch(auth("manageDiscussions"), validate(discussionValidation.updateDiscussion), discussionController.updateDiscussion)
  .delete(auth("manageDiscussions"), validate(discussionValidation.deleteDiscussion), discussionController.deleteDiscussion);

module.exports = router;
