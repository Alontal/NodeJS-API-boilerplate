const mongoose = require('mongoose'),
	logger = require('../../app/util/logger'),
	config = require('./config/config')

class Db {
	constructor() {}
	connectToDB() {
		mongoose.connect(
			process.env.MONGO_DB_CONNECTION_STR,
			config,
			err => {
				if (err) return logger.error(`Could not connect to mongoDB error: ${err}`);
				logger.info('Connected to mongoDB at:' + process.env.MONGO_DB_CONNECTION_STR);
			}
		);
		mongoose.set('useCreateIndex', true);
	}

	disconnect() {
		logger.info(`disconnect from ${process.env.MONGO_DB_CONNECTION_STR}`);
		mongoose.disconnect(d => {
			if (d.error) {
				logger.error('mongoose.disconnect err:', d.error);
			}
		});
	}
}

module.exports = Db;
