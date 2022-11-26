const Joi = require('joi');

const createTag = {
  body: Joi.object().keys({
    name: Joi.string().required(),
  }),
};

const findTagByName = {
  query: Joi.object().keys({
    name: Joi.string().required(),
  }),
};

const getTagById = {
  params: Joi.object().keys({
    tagId: Joi.string().required(),
  }),
};

const updateTag = {
  params: Joi.object().keys({
    tagId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    name: Joi.string().required(),
  }),
};

const deleteTag = {
  params: Joi.object().keys({
    tagId: Joi.string().required(),
  }),
};

module.exports = {
  createTag,
  findTagByName,
  getTagById,
  updateTag,
  deleteTag,
};
