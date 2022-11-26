const faker = require('faker');
const bcrypt = require('bcryptjs');
const { Question } = require('../../src/models/Question');
const { User } = require('../../src/models/User');

const password = '1dadsA23448@sdf596';
const salt = bcrypt.genSaltSync(8);
const hashedPassword = bcrypt.hashSync(password, salt);

const insertUserAndQuestion = async (role) => {
  const user = await User.create({
    username: `${faker.name.lastName()}_${faker.datatype.uuid()}`,
    email: `${faker.datatype.uuid()}_${faker.internet.email().toLowerCase()}`,
    profile_image: `https://avatars.dicebear.com/api/initials/${password}.svg`,
    password: hashedPassword,
    role,
  });

  const { id } = user;

  const question = await Question.create({
    UserId: id,
    title: faker.lorem.lines(1),
    body: faker.lorem.paragraph(3),
    tags: [{ name: faker.random.alphaNumeric(5) }],
  });

  return { user, question };
};

module.exports = {
  insertUserAndQuestion,
};
