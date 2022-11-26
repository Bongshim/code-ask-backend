const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

exports.Discussion = sequelize.define("Discussion", {
  topic: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});
