const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

exports.Discussion_Reply_Nested = sequelize.define("Discussion_reply_nested", {
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
