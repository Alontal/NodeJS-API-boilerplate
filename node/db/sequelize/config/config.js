require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DEVELOPMENT_DB_USERNAME,
    password: process.env.DEVELOPMENT_DB_PASSWORD,
    database: process.env.DEVELOPMENT_DB_DATABASE,
    host: process.env.DEVELOPMENT_DB_HOST,
    dialect: 'mysql'
  },
  test: {
    username: process.env.TEST_DB_USERNAME,
    password: process.env.TEST_DB_PASSWORD,
    database: process.env.TEST_DB_DATABASE,
    host: process.env.TEST_DB_HOST,
    dialect: 'mysql'
  },
  production: {
    username: process.env.PRODUCTION_DB_USERNAME,
    password: process.env.PRODUCTION_DB_PASSWORD,
    database: process.env.PRODUCTION_DB_DATABASE,
    host: process.env.PRODUCTION_DB_HOST,
    dialect: 'mysql'
  }
};
