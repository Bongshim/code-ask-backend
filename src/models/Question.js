const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

exports.Question = sequelize.define("Question", {
    title: {
        type: DataTypes.STRING,
        unique: {
          arg: true,
          msg: 'Title must be unique.'
        }
      },
    body: {
        type: DataTypes.TEXT('long'),
      },
})