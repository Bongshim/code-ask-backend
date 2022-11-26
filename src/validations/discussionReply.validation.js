const Joi = require('joi');

const createReply = {
  body: Joi.object().keys({
    UserId: Joi.string(),
    DiscussionId: Joi.number().required(),
    content: Joi.string().required(),
  }),
};

const getReply = {
  params: Joi.object().keys({
    discussionReplyId: Joi.string().required(),
  }),
};

const updateReply = {
  params: Joi.object().keys({
    discussionReplyId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    content: Joi.string()
  }),
};

const deleteReply = {
  params: Joi.object().keys({
    discussionReplyId: Joi.string().required(),
  }),
};

module.exports = {
  createReply,
  getReply,
  updateReply,
  deleteReply,
};
