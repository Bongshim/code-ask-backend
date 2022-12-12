const { axiosCall } = require('../helpers/axiosCall');
const logger = require('../config/logger');

/**
 * Get answerIds stackoverflow
 * @param {questionIds} array
 * @return {promise<result>}
 */
const getStackOverflowAnswerIds = async (questionIds) => {
  const answerIds = [];

  await Promise.all(
    questionIds.map(async (id) => {
      try {
        const response = await axiosCall.get(
        `https://api.stackexchange.com/2.3/questions/${id}/answers?order=desc&sort=activity&site=stackoverflow`
      );
      const eachId = response.data.items;

      eachId.map(async (item) => {
        answerIds.push(`https://stackoverflow.com/a/${item.answer_id}`);
      });
      } catch (error) {
        console.log(error)
      }
      
    })
  );

  return answerIds;
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

  return answerIds;
  } catch (error) {
    console.log(error)

  }
  
};

module.exports = { searchStackOverflow };
