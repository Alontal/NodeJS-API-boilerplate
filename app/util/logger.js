
var winston = require('winston'),
path = require("path"),
fs = require('fs'),
mkdirp = require('mkdirp');
logs_config = require('../../config/config').LOG_CONFIG;

var logDir = path.resolve('/var/log/' + logs_config.logging_dir);
console.log('Logs will write to Directory >> ', logDir);
if (!fs.existsSync(logDir)) {
mkdirp(logDir, (err) => {
    if (err) console.error(err)
    else console.log('log directory created!')
});
}
const timeStampFormat = () => (new Date()).toLocaleDateString() + ' : ' + (new Date()).toLocaleTimeString() //date format for timestamp

//daily rotate log files
require('winston-daily-rotate-file');
var daily_rotate_transport = new (winston.transports.DailyRotateFile)({
datePattern: 'yyyy-MM-dd.',
filename: logDir +  logs_config.log_file_name+'.log',
prepend: true,
// level: process.env.ENV === 'development' ? 'debug' : 'info'
level: logs_config.level_rotate,
maxSize: '20m',
maxFiles: '14d',
json: true,
timestamp: timeStampFormat
});

//log error messages to console and everything rate as info and below save to file (which includes error messages):
var console_opts = { //set the level to print to console 
level: logs_config.level_console,
colorize: true,
prettyPrint: true,
timestamp: timeStampFormat,
json: false
// logstash: true
}
//log what defined above $'level' to specific file and add timestamp
var file_opts = {
// filename: 'path/to/all-logs.log',
filename: logDir + logs_config.log_file_name,
level: logs_config.level_log,
//logger.log wont print to log file   
json: true,
timestamp: timeStampFormat,
// logstash: true
}
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
if (process.env.NODE_ENV === "production") {
logger.handleExceptions(
    new winston.transports.File(
        {
            filename: logDir + logs_config.log_file_name_Exceptions
        }
    ));
//prevent winston to stop if Error occurred  
logger.exitOnError = false;
// logger.cli();
}

// // TEST all logs 
// ************************************************************
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
// ************************************************************
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