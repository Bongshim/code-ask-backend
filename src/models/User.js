const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

exports.User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        msg: 'Invalid email',
      },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
  },
  about: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
  },
  stack: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
  },
  profile_image: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
  },
  google_id: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
  },
  linkedin_id: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
  },
  github_id: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
  },
  twitter_profile: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
  },
  linkedin_profile: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
  },
  github_profile: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
  },
  user_location: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
  },
  last_seen: {
    type: DataTypes.DATE,
    allowNull: true,
    unique: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "user",
  },
});
