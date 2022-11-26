const { tagService } = require('../services');
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const logger = require('../config/logger');

const createTag = catchAsync(async (req, res) => {
  const tag = await tagService.createTag(req.body);
  res.status(httpStatus.CREATED).json(tag);
});

const getTags = catchAsync(async (req, res) => {
  const tag = await tagService.getTags();
  res.status(httpStatus.OK).json(tag);
});

const getTagByName = catchAsync(async (req, res) => {
  logger.info(req.query.name)
  const tag = await tagService.findTagByName(req.query.name);
  res.status(httpStatus.OK).json(tag);
});

const getTagById = catchAsync(async (req, res) => {
  const tag = await tagService.findTagById(req.params.tagId);
  res.status(httpStatus.OK).json(tag);
});

const updateTag = catchAsync(async (req, res) => {
  await tagService.updateTag(req.params.tagId, req.body);
  res.status(httpStatus.OK).json({ success: 'Updated' });
});

const deleteTag = catchAsync(async (req, res) => {
  await tagService.deleteTag(req.params.tagId);
  res.status(httpStatus.OK).json({ success: 'Deleted' });
});

module.exports = {
  createTag,
  getTags,
  getTagByName,
  getTagById,
  updateTag,
  deleteTag,
};
