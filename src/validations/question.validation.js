const Joi = require('joi');

const createQuestion = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    body: Joi.string().required(),
    tags: Joi.array().items({
      name: Joi.string().required(),
    }),
  }),
};

const getQuestion = {
  params: Joi.object().keys({
    questionId: Joi.string().required(),
  }),
};

const updateQuestion = {
  params: Joi.object().keys({
    questionId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    title: Joi.string(),
    body: Joi.string(),
    tags: Joi.array().items({
      name: Joi.string(),
    }),
  }),
};

const deleteQuestion = {
  params: Joi.object().keys({
    questionId: Joi.string().required(),
  }),
};

module.exports = {
  createQuestion,
  updateQuestion,
  getQuestion,
  deleteQuestion
};
