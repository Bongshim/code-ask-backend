const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

exports.Answer = sequelize.define("Answer", {
  content: {
    type: DataTypes.STRING(1000),
    allowNull: false,
  },
  upvotes: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  downvotes: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  accepted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});
