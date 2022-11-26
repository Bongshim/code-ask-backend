const { User } = require('../models/User');
const bcrypt = require('bcryptjs');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

/**
 * Check if email is taken
 * @param {string} email
 * @return {promise<boolean>}
 */
const isEmailTaken = async (email) => {
  const user = await User.findOne({ where: { email } });
  return !!user;
};

/**
 * Check if the password is the user's stored password
 * @param {string} password
 * @return {promise<boolean>}
 */
const isPasswordMatch = async (password, user) => {
  const comp = bcrypt.compare(password, user.password);
  return comp;
};

/**
 * Check if the password is the user's stored password
 * @param {object} userBody
 * @return {promise<User>}
 */
const createUser = async (userBody) => {
  if (await isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  userBody.password = await bcrypt.hashSync(userBody.password, 10);
  userBody.profile_image = `https://avatars.dicebear.com/api/initials/${userBody.username}.svg`;

  const { id } = await User.create(userBody);
  return await User.findOne({ where: { id }, attributes: ['id', 'username', 'profile_image', 'role'] });
};

/**
 * Get all users
 * @returns {Promise<users>}
 */
const getUsers = async () => {
  const users = await User.findAll();
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  const user = await User.findByPk(id);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return user;
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);

  return await User.update(user.dataValues, {
    where: {
      id: userId,
    },
  });
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return await User.destroy({ where: { id: userId } });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  isPasswordMatch,
};
