const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

exports.Discussion_Reply = sequelize.define("Discussion_reply", {
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
