const Joi = require('joi');

const createAnswer = {
  body: Joi.object().keys({
    UserId: Joi.string(),
    QuestionId: Joi.number().required(),
    content: Joi.string().required(),
  }),
};

const getAnswer = {
  params: Joi.object().keys({
    answerId: Joi.string().required(),
  }),
};

const updateAnswer = {
  params: Joi.object().keys({
    answerId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    content: Joi.string().required(),
  }),
};

const upvoteAnswer = {
  params: Joi.object().keys({
    answerId: Joi.string().required(),
  })
};

const downvoteAnswer = {
  params: Joi.object().keys({
    answerId: Joi.string().required(),
  })
};

const acceptedAnswer = {
  params: Joi.object().keys({
    answerId: Joi.string().required(),
  }),
};

const deleteAnswer = {
  params: Joi.object().keys({
    answerId: Joi.string().required(),
  }),
};

module.exports = {
  createAnswer,
  getAnswer,
  updateAnswer,
  deleteAnswer,
  acceptedAnswer,
  downvoteAnswer,
  upvoteAnswer
};
