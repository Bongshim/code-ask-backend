const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

exports.Tag = sequelize.define("Tag", {
       name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
})