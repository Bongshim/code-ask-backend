const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

exports.Comment = sequelize.define("Comment", {
  comment: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
