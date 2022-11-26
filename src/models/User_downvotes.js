const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { User } = require('./User');
const { Answer } = require('./Answer');

exports.Downvote = sequelize.define('Downvote', {
  UserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  AnswerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Answer,
      key: 'id',
    },
  },
});
