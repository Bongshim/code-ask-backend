const { axiosCall } = require('../helpers/axiosCall');
const cheerio = require('cheerio');

const logger = require('../config/logger');

/**
 * Get answerIds stackoverflow
 * @param {questionIds} array
 * @return {promise<result>}
 */
const getStackOverflowAnswers = async (links) => {
  const answersBody = [];
  try {
    await Promise.all(
      links.map(async (item) => {
        const pack = {};
        const answerPage = `https://stackoverflow.com/a/${item}`;
        const res = await axiosCall.get(answerPage);
        let $ = cheerio.load(res.data);
        pack.question = $('.fs-headline1').children().html();
        const content = $(`#answer-${item}`).html();
        $ = cheerio.load(content);
        pack.answer = $('.js-post-body').html();
        pack.stackOverflow = true;
        answersBody.push(pack);
      })
    );

    return answersBody;
  } catch (err) {
    console.log(err);
  }
};

const getStackOverflowAnswerIds = async (questionIds) => {
  const answerIds = [];
  try {
    await Promise.all(
      questionIds.map(async (id) => {
        const response = await axiosCall.get(
          `https://api.stackexchange.com/2.3/questions/${id}/answers?order=desc&sort=activity&site=stackoverflow`
        );
        const eachId = response.data.items;

        eachId.map(async (item) => {
          answerIds.push(item.answer_id);
        });
      })
    );
    return answerIds;
  } catch (error) {
    console.log(error);
  }
};

/**
 * Search stackoverflow
 * @param {string} string
 * @return {promise<result>}
 */
const searchStackOverflow = async (string) => {
  try {
    const response = await axiosCall.get(`/2.3/search/excerpts?order=desc&sort=votes&body=${string}&site=stackoverflow`);
    const result = response.data.items;
    const filtered = result.filter((result) => result?.answer_count > 0);
    const questionIds = filtered.map((item) => item.question_id);
    const answerIds = await getStackOverflowAnswerIds(questionIds);
    const answers = await getStackOverflowAnswers(answerIds);

    return answers;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { searchStackOverflow };
