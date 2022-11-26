const Joi = require('joi');

const createAnswerComment = {
  query: Joi.object().keys({
    answerId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    UserId: Joi.string(),
    comment: Joi.string().required(),
  }),
};

const createQuestionComment = {
  query: Joi.object().keys({
    questionId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    UserId: Joi.string(),
    comment: Joi.string().required(),
  }),
};

const getComment = {
  params: Joi.object().keys({
    commentId: Joi.string().required(),
  }),
};

const updateComment = {
  params: Joi.object().keys({
    commentId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    comment: Joi.string().required(),
  }),
};

const deleteComment = {
    params: Joi.object().keys({
      commentId: Joi.string().required(),
    }),
  };


  module.exports = {
    createAnswerComment,
    createQuestionComment,
    getComment,
    updateComment,
    deleteComment
  }