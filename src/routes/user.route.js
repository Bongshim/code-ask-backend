const express = require('express');
const validate = require('../middleware/validate');
const userValidation = require('../validations').userValidation;
const userController = require('../controllers').userController;
const { auth } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(userValidation.createUser), userController.createUser)
  .get(auth(), userController.getUsers);

router
  .route('/:userId')
  .get(auth(), validate(userValidation.getUser), userController.getUser)
  .patch(auth(), validate(userValidation.updateUser), userController.updateUser)
  .delete(auth(), validate(userValidation.deleteUser), userController.deleteUser);

module.exports = router;
