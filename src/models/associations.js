const { User } = require('./User');
const { Question } = require('./Question');
const { Tag } = require('./Tag');
const { Answer } = require('./Answer');
const { Comment } = require('./Comment');
const { Discussion } = require('./Discussion');
const { Discussion_Reply } = require('./Discussion_reply');
const { Discussion_Reply_Nested } = require('./Discussion_reply_nested');

exports.association = () => {
  // ONE TO MANY

  // user to question association
  User.hasMany(Question);
  Question.belongsTo(User);

  // user to answer association
  User.hasMany(Answer);
  Answer.belongsTo(User);

  // question to answer association
  Question.hasMany(Answer);
  Answer.belongsTo(Question);

  // comment to user association
  User.hasMany(Comment);
  Comment.belongsTo(User);

  // discussion to user association
  User.hasMany(Discussion);
  Discussion.belongsTo(User);

  //   discussion to discussion reply association
  Discussion.hasMany(Discussion_Reply);
  Discussion_Reply.belongsTo(Discussion);

  // discussion reply to user association
  User.hasMany(Discussion_Reply);
  Discussion_Reply.belongsTo(User);

  //   discussion reply to discussion nested reply association
  Discussion_Reply.hasMany(Discussion_Reply_Nested);
  Discussion_Reply_Nested.belongsTo(Discussion_Reply);

  //   user to discussion nested reply association
  User.hasMany(Discussion_Reply_Nested);
  Discussion_Reply_Nested.belongsTo(User);

  // MANY TO MANY

  //   tags to question association
  Tag.belongsToMany(Question, { through: 'question_tags' });
  Question.belongsToMany(Tag, { through: 'question_tags' });

  //   comment to question association
  Question.belongsToMany(Comment, { through: 'question_comments' });
  Comment.belongsToMany(Question, { through: 'question_comments' });

  //   comment to answwer association
  Answer.belongsToMany(Comment, { through: 'answer_comments' });
  Comment.belongsToMany(Answer, { through: 'answer_comments' });

 
};
