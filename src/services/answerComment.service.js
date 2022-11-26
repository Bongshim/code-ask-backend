const { Comment } = require('../models/Comment');
const { Answer } = require('../models/Answer');


/**
 * Create comment
 * @param {string} userId
 * @param {Object} commentBody
 * @return {promise<Comment>}
 */
const createComment = async (userId, answerId, commentBody) => {
  const answer = await Answer.findOne({ where: { id: answerId } });
  commentBody['UserId'] = userId;
  const comment = await Comment.create(commentBody);
  await answer.addComment(comment, { through: { selfGranted: false } });

  return comment;
};



module.exports = {
  createComment,

};
