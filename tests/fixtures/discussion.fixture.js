const faker = require('faker');
const bcrypt = require('bcryptjs');
const { Discussion } = require('../../src/models/Discussion');
const { User } = require('../../src/models/User');

const password = '1dadsA23448@sdf596';
const salt = bcrypt.genSaltSync(8);
const hashedPassword = bcrypt.hashSync(password, salt);

const insertUserAndDiscussion = async (role) => {
  const user = await User.create({
    username: `${faker.name.lastName()}_${faker.datatype.uuid()}`,
    email: `${faker.datatype.uuid()}_${faker.internet.email().toLowerCase()}`,
    profile_image: `https://avatars.dicebear.com/api/initials/${password}.svg`,
    password: hashedPassword,
    role
  });

  const { id } = user;

  const discussion = await Discussion.create({
    topic: faker.lorem.lines(1),
    UserId: id,
  });

  return { user, discussion };
};

module.exports = {
  insertUserAndDiscussion,
};
