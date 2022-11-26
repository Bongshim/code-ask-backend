const faker = require('faker');
const bcrypt = require('bcryptjs');
const { Answer } = require('../../src/models/Answer');
const { User } = require('../../src/models/User');

const password = '1dadsA23448@sdf596';
const salt = bcrypt.genSaltSync(8);
const hashedPassword = bcrypt.hashSync(password, salt);

const insertUserAndAnswer = async (questionId, role) => {
  const user = await User.create({
    username: `${faker.name.lastName()}_${faker.datatype.uuid()}`,
    email: `${faker.datatype.uuid()}_${faker.internet.email().toLowerCase()}`,
    profile_image: `https://avatars.dicebear.com/api/initials/${password}.svg`,
    password: hashedPassword,
    role,
  });

  const { id } = user;

  const answer = await Answer.create({
    QuestionId: questionId,
    UserId: id,
    content: faker.lorem.paragraph(3),
  });

  return { user, answer };
};

module.exports = {
  insertUserAndAnswer,
};
