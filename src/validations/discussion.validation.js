const Joi = require('joi');

const createDiscussion = {
  body: Joi.object().keys({
    UserId: Joi.string(),
    topic: Joi.string().required(),
  }),
};

const getDiscussion = {
  params: Joi.object().keys({
    discussionId: Joi.string().required(),
  }),
};

const updateDiscussion = {
  params: Joi.object().keys({
    discussionId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    topic: Joi.string().required(),
  }),
};

const deleteDiscussion = {
    params: Joi.object().keys({
      discussionId: Joi.string().required(),
    }),
  };


  module.exports = {
    createDiscussion,
    getDiscussion,
    updateDiscussion,
    deleteDiscussion
  }