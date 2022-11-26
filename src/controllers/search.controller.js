const { searchService } = require('../services');
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const logger = require('../config/logger');


const searchAnswers = catchAsync(async (req, res) => {
    // res.status(httpStatus.OK).json(req.query.q);
  const answers = await searchService.search(req.query.q);
  res.status(httpStatus.OK).json(answers);
});

module.exports = {
    searchAnswers
};
