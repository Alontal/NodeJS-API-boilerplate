const {
  LOCAL_DB_USERNAME,
  LOCAL_DB_PASSWORD,
  LOCAL_DB_DATABASE,
  LOCAL_DB_HOST,
  LOCAL_DB_DIALECT,
  DEVELOPMENT_DB_USERNAME,
  DEVELOPMENT_DB_PASSWORD,
  DEVELOPMENT_DB_DATABASE,
  DEVELOPMENT_DB_HOST,
  DEVELOPMENT_DB_DIALECT,
  PRODUCTION_DB_USERNAME,
  PRODUCTION_DB_PASSWORD,
  PRODUCTION_DB_DATABASE,
  PRODUCTION_DB_HOST,
  PRODUCTION_DB_DIALECT
} = process.env;

module.exports = {
  local: {
    username: LOCAL_DB_USERNAME,
    password: LOCAL_DB_PASSWORD,
    database: LOCAL_DB_DATABASE,
    host: LOCAL_DB_HOST,
    dialect: LOCAL_DB_DIALECT
  },
  development: {
    username: DEVELOPMENT_DB_USERNAME,
    password: DEVELOPMENT_DB_PASSWORD,
    database: DEVELOPMENT_DB_DATABASE,
    host: DEVELOPMENT_DB_HOST,
    dialect: DEVELOPMENT_DB_DIALECT
  },
  production: {
    username: PRODUCTION_DB_USERNAME,
    password: PRODUCTION_DB_PASSWORD,
    database: PRODUCTION_DB_DATABASE,
    host: PRODUCTION_DB_HOST,
    dialect: PRODUCTION_DB_DIALECT
  }
};
