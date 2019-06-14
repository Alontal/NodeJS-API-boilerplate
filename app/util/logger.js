const { createLogger, format, transports } = require('winston'),
	path = require('path'),
	fs = require('fs'),
	mkdirp = require('mkdirp'),
	{ dateFormats } = require('./');

require('winston-daily-rotate-file');

const logs_config = {
	log_file_name: process.env.APP_DOMAIN || 'APP_DOMAIN',
	log_file_name_Exceptions: '/uncaughtExceptions',
	logging_dir: 'node',
	//set the levels that will be printed in matching file
	level_log: process.env.ENV === 'production' ? 'info' : 'debug',
	level_exception: 'debug',
	level_console: process.env.ENV === 'production' ? 'info' : 'debug',
	level_rotate: process.env.ENV === 'production' ? 'info' : 'debug'
};

const LOG_DIR = path.resolve(__dirname, '..', '..', 'LOG/');
if (!fs.existsSync(LOG_DIR)) {
	mkdirp(LOG_DIR, err => {
		if (err) console.error(err);
		else console.log('log directory created!');
	});
}

//daily rotate log files
const daily_rotate_transport = level => ({
	filename:
		level !== 'error'
			? `${LOG_DIR}/ ${logs_config.log_file_name}.log`
			: `${LOG_DIR}/ ${logs_config.log_file_name}-error.log`,
	prepend: true,
	level: level,
	maxSize: '20m',
	maxFiles: '14d'
});

console.info('Logs will write to Directory >> ', LOG_DIR);

const logger = createLogger({
	level: 'info',
	format: format.combine(
		format.timestamp({
			format: dateFormats.REVERSED_SHORTDATE_TIME
		}),
		format.errors({ stack: true }),
		format.splat(),
		format.json()
	),
	transports: [
		//
		// - Write to all logs with level `info` and below to `combined.log`
		// - Write all logs error (and below) to `error.log`.
		//
		new transports.DailyRotateFile(daily_rotate_transport('error')),
		new transports.DailyRotateFile(daily_rotate_transport('info'))
	]
});

//
// If we're not in production then **ALSO** log to the `console`
// with the colorized simple format.
//

if (process.env.NODE_ENV !== 'production') {
	logger.add(
		new transports.Console({
			format: format.combine(
				format.colorize(),
				format.simple(),
				format.printf(
					info => `${info.timestamp} ${info.level}: ${info.message}`
				)
			)
		})
	);
} else {
	//prevent winston to stop if Error occurred
	logger.exitOnError = false;
	// logger.cli();
	logger.exitOnError = false;
}

// // TEST all logs
// ********************
//                       Example
// logger.log('silly', "127.0.0.1 - Logger is working ");
// logger.log('debug', "127.0.0.1 - Logger is working ");
// logger.log('verbose', "127.0.0.1 - Logger is working ");
// logger.log('info', "127.0.0.1 - Logger is working info");
// logger.log('warn', "127.0.0.1 - Logger is working warn");
// logger.log('error', "127.0.0.1 - Logger is working error");

// logger.silly('silly', "127.0.0.1 - Logger is working ");
// logger.debug('debug', "127.0.0.1 - Logger is working ");
// logger.verbose('verbose', "127.0.0.1 - Logger is working ");
// logger.info('info', "127.0.0.1 - Logger is working info");
// logger.warn('warn', "127.0.0.1 - Logger is working warn");
// logger.error('error', "127.0.0.1 - Logger is working error");

// logger.info("127.0.0.1 - Logger is working info");
// logger.warn("127.0.0.1 - Logger is working warn");
// logger.error("127.0.0.1 - Logger is working error");
// ********************
// var complexObject = {
//     name: {
//         first: "Barry",
//         last: "Allen"
//     },
//     employer: "Central City Police Department",
//     country: "United States",
//     skills: [
//         'The Fastest Man Alive'
//     ]
// }
// test complex obj
// logger.warn('Logger is working error', complexObject);

// logger.error('BRAND SYNC FAILED' , complexObject);

module.exports = logger;
