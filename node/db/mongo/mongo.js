const mongoose = require('mongoose');
const logger = require('../../app/util/logger');
const config = require('./config/config');

const { MONGO_DB_CONNECTION_STR } = process.env;

class Db {
  constructor() {
    this.CONNECTION_STR = MONGO_DB_CONNECTION_STR;
  }

  connectToDB() {
    mongoose.connect(
      this.CONNECTION_STR,
      config,
      (err) => {
        if (err) return logger.error(`Could not connect to mongoDB error: ${err}`);
        logger.info(`Connected to mongoDB at:${this.MONGO_DB_CONNECTION_STR}`);
      }
    );
    mongoose.set('useCreateIndex', true);
  }

  disconnect() {
    logger.info(`disconnect from ${this.MONGO_DB_CONNECTION_STR}`);
    mongoose.disconnect((d) => {
      if (d.error) {
        logger.error('mongoose.disconnect err:', d.error);
      }
    });
  }
}

module.exports = Db;
