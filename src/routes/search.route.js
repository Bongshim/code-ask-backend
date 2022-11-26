const express = require('express');
const validate = require('../middleware/validate');
const {searchController} = require('../controllers');
const { auth } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(searchController.searchAnswers);


module.exports = router;
