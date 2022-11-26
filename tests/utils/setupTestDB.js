const Sequelize = require('sequelize');
const { sequelize } = require('../../src/config/config');
const { association } = require('../../src/models/associations');
const { User } = require('../../src/models/User');

const sequelizeInstance = new Sequelize(sequelize.url);

const setupTestDB = () => {
  beforeAll(async () => {
    console.log('syncing test database');
    await sequelizeInstance.authenticate();

    association();
  });

  afterAll(async () => {

    await sequelizeInstance.close();
    console.log('closed test database');
  });
};

module.exports = setupTestDB;
