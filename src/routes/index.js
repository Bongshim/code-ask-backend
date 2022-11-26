const express = require('express');
const userRoutes = require('./user.route');
const discussionRoutes = require('./discussion.route');
const discussionReplyRoutes = require('./discussionReply.route');
const discussionReplyNestedRoutes = require('./discussionReplyNested.route');
const questionRoutes = require('./question.route');
const answerRoutes = require('./answer.route');
const answerCommentRoutes = require('./answerComment.route');
const questionCommentRoutes = require('./questionComment.route');
const commentRoutes = require('./comment.route');
const tagRoutes = require('./tag.route');
const authRoutes = require('./auth.route');
const searchRoutes = require('./search.route');
const router = express.Router();

const defaultRoutes = [
  { path: '/users', route: userRoutes },
  { path: '/discussions/reply/nested', route: discussionReplyNestedRoutes },
  { path: '/discussions/reply', route: discussionReplyRoutes },
  { path: '/discussions', route: discussionRoutes },
  { path: '/comments', route: commentRoutes },
  { path: '/questions/comments', route: questionCommentRoutes },
  { path: '/questions', route: questionRoutes },
  { path: '/answers/comments', route: answerCommentRoutes },
  { path: '/answers', route: answerRoutes },
  { path: '/search', route: searchRoutes },
  { path: '/tags', route: tagRoutes },
  { path: '/auth', route: authRoutes },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
