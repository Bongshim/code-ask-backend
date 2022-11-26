const Sequelize = require('sequelize');
const { sequelize } = require('../config/config');

exports.sequelize = new Sequelize(sequelize.url);
