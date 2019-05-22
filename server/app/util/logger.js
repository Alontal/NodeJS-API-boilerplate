/* eslint-disable no-console */
const winston = require('winston'),
	path = require('path'),
	fs = require('fs'),
	mkdirp = require('mkdirp'),
	moment = require('moment');

const logs_config = {
	log_file_name: process.env.APP_DOMAIN,
	log_file_name_Exceptions: '/uncaughtExceptions',
	logging_dir: 'node',
	//set the levels that will be printed in matching file
	level_log: process.env.ENV === 'production' ? 'info' : 'debug',
	level_exception: 'debug',
	level_console: process.env.ENV === 'production' ? 'info' : 'debug',
	level_rotate: process.env.ENV === 'production' ? 'info' : 'debug'
};

const LOG_DIR = path.resolve(__dirname, '..', '..', 'LOG/');

const timeStampFormat = () => moment().format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);

//daily rotate log files
require('winston-daily-rotate-file');
const daily_rotate_transport = new(winston.transports.DailyRotateFile)({
	filename: LOG_DIR + logs_config.log_file_name + '.log',
	prepend: true,
	// level: process.env.ENV === 'development' ? 'debug' : 'info'
	level: logs_config.level_rotate,
	maxSize: '20m',
	maxFiles: '14d',
	json: true,
	timestamp: timeStampFormat
});

//log error messages to console and everything rate as info and below save to file (which includes error messages):
const console_opts = { //set the level to print to console 
	level: logs_config.level_console,
	colorize: true,
	prettyPrint: true,
	timestamp: timeStampFormat,
	json: false
	// logstash: true
};

//set winston transports to obj's define above
var logger = new winston.Logger({
	levels: winston.config.syslog.levels,
	transports: [
		new winston.transports.Console(console_opts),
		// new winston.transports.File(file_opts),
		daily_rotate_transport

	]
});
// make winston catch Exceptions and print them to diff log file
if (process.env.NODE_ENV === 'production') {
	logger.handleExceptions(
		new winston.transports.File({
			filename: LOG_DIR + logs_config.log_file_name_Exceptions
		}));
	//prevent winston to stop if Error occurred  
	logger.exitOnError = false;
	// logger.cli();
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
// logger.warning('warn', "127.0.0.1 - Logger is working warn");
// logger.error('error', "127.0.0.1 - Logger is working error");

// logger.info("127.0.0.1 - Logger is working info");
// logger.warning("127.0.0.1 - Logger is working warn");
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
// logger.warning('Logger is working error', complexObject);

// logger.error('BRAND SYNC FAILED' , complexObject);

module.exports = logger;