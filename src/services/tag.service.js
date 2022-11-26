const { Tag } = require('../models/Tag');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

/**
 * Create question
 * @param {Object} tagBody
 * @return {promise<Tag>}
 */
const createTag = async (tagBody) => {
  return await Tag.create(tagBody);
};

/**
 * Find all tags
 * @return {promise<Tag>}
 */
const getTags = async () => {
  return await Tag.findAll();
};

/**
 * Find tag by name
 * @param {string} tagName
 * @return {promise<Tag>}
 */
const findTagByName = async (tagName) => {
  return await Tag.findOne({
    where: {
      name: tagName,
    },
  });
};

/**
 * Find tag by Id
 * @param {string} tagId
 * @return {promise<Tag>}
 */
const findTagById = async (tagId) => {
  return await Tag.findByPk(tagId);
};

/**
 * Update tag
 * @param {string} tagId
 * @param {object} tagBody
 * @return {promise<Tag>}
 */
const updateTag = async (tagId, tagBody) => {
  const tag = await findTagById(tagId);
  if (!tag) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Tag not found');
  }
  Object.assign(tag, tagBody);
  return await Tag.update(tag.dataValues, { where: { id: tagId } });
};

/**
 * Delete tag
 * @param {string} tagId
 * @return {promise<Tag>}
 */
const deleteTag = async (tagId) => {
  const tag = await findTagById(tagId);
  if (!tag) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Tag not found');
  }
  return await Tag.destroy({where:{id:tagId}});
};

module.exports = {
  createTag,
  getTags,
  findTagByName,
  findTagById,
  updateTag,
  deleteTag,
};
