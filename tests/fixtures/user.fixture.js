const bcrypt = require('bcryptjs');
const faker = require('faker');
const { User } = require('../../src/models/User');

const password = '1dadsA23448@sdf596';
const salt = bcrypt.genSaltSync(8);
const hashedPassword = bcrypt.hashSync(password, salt);

const userOne = {
  username: `${faker.name.lastName()}_${faker.datatype.uuid()}`,
  email: `${faker.datatype.uuid()}_${faker.internet.email().toLowerCase()}`,
  password,
  role: 'user',
};

const userTwo = {
  username: `${faker.name.lastName()}_${faker.datatype.uuid()}`,
  email: `${faker.datatype.uuid()}_${faker.internet.email().toLowerCase()}`,
  password,
  role: 'user',
};

const admin = {
  username: `${faker.name.lastName()}_${faker.datatype.uuid()}`,
  email: `${faker.datatype.uuid()}_${faker.internet.email().toLowerCase()}`,
  password,
  role: 'admin',
};

const insertUser = async (role) => {
  return await User.create({
    username: `${faker.name.lastName()}_${faker.datatype.uuid()}`,
    email: `${faker.datatype.uuid()}_${faker.internet.email().toLowerCase()}`,
    profile_image: `https://avatars.dicebear.com/api/initials/${password}.svg`,
    password: hashedPassword,
    role,
  });
};

const insertUsers = async (users) => {
  return await User.bulkCreate(
    users.map((user) => ({
      ...user,
      password: hashedPassword,
      profile_image: `https://avatars.dicebear.com/api/initials/${user.username}.svg`,
    }))
  );
};

module.exports = {
  userOne,
  userTwo,
  admin,
  insertUsers,
  insertUser,
};
