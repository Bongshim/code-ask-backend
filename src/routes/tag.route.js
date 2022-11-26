const express = require('express');
const validate = require('../middleware/validate');
const tagValidation = require('../validations').tagValidation;
const tagController = require('../controllers').tagController;
const { auth } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(tagValidation.createTag), tagController.createTag)
  .get(auth(), tagController.getTags)
  
  router
  .route('/filter')
  .get(auth(), validate(tagValidation.findTagByName), tagController.getTagByName)
  
  router
  .route('/:tagId?')
  .get(auth(), validate(tagValidation.getTagById), tagController.getTagById)
  .patch(auth(), validate(tagValidation.updateTag), tagController.updateTag)
  .delete(auth(), validate(tagValidation.deleteTag), tagController.deleteTag);

module.exports = router;
