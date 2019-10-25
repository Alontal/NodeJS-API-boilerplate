const {
  createLogger, format, transports, log
} = require('winston');
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
require('winston-daily-rotate-file');

const { NODE_ENV, SERVICE_NAME = 'SERVICE_NAME' } = process.env;
const { dateFormats } = require('.');


const loggerConfig = {
  maxSize: '30m',
  maxFiles: '3d',
  zippedArchive: false
};
const LOG_DIR = path.resolve(path.dirname(require.main.filename), `../log/${SERVICE_NAME.toLowerCase()}`);
// const LOG_DIR = path.resolve(__dirname, '..', '..', 'LOG/');
if (!fs.existsSync(LOG_DIR)) {
  mkdirp(LOG_DIR, (err) => {
    if (err) log().error(err);
    else log().info('log directory created!');
  });
}

const createLogFileName = (level) => `${LOG_DIR}/${SERVICE_NAME}-${level}.%DATE%.log`;

// eslint-disable-next-line no-console
console.info('Logs will write to Directory >> ', LOG_DIR);

const defaultTransport = new transports.DailyRotateFile({
  filename: createLogFileName('info'),
  datePattern: dateFormats.SHORT_DATETIME,
  zippedArchive: loggerConfig.zippedArchive,
  maxSize: loggerConfig.maxSize,
  maxFiles: loggerConfig.maxFiles
});
const exceptionsTransport = new transports.DailyRotateFile({
  filename: createLogFileName('exceptions'),
  datePattern: dateFormats.SHORT_DATETIME,
  zippedArchive: loggerConfig.zippedArchive,
  maxSize: loggerConfig.maxSize,
  maxFiles: loggerConfig.maxFiles
});
const consoleTransport = new transports.Console({
  level: 'debug',
  format: format.combine(
    format.colorize(),
    format.simple(),
    format.timestamp({
      format: dateFormats.SHORT_DATETIME
    }),
    format.printf(
      (info) => `[${info.timestamp}] [${NODE_ENV}] [${SERVICE_NAME}] [${info.level}]: ${
        info.message
      }${JSON.stringify((info.data || info.stack || info.error || ''))}`
    )
  )
});

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: dateFormats.SHORT_DATETIME
    }),
    format.label({ label: { environment: NODE_ENV, service_name: SERVICE_NAME }, message: false }),
    format.errors({ stack: true }),
    format.splat()
    // format.json()
  ),
  defaultMeta: {
    service: SERVICE_NAME
  },
  transports: [
    defaultTransport
  ],
  exceptionHandlers: [
    exceptionsTransport
  ]
});

// If we're not in production then *ALSO* log to the `console`
// with the colorized simple format.
if (process.env.NODE_ENV !== 'production') {
  logger.add(consoleTransport);
} else {
  // prevent winston to stop if Error occurred
  logger.exitOnError = false;
}

// *****
// Allows for JSON logging
// *****

// logger.log({
//   level: 'info',
//   message: 'Pass an object and this works',
//   additional: 'properties',
//   are: 'passed along'
// });

// logger.info({
//   message: 'Use a helper method if you want',
//   additional: 'properties',
//   are: 'passed along'
// });

// // *****
// // Allows for parameter-based logging
// // *****

// logger.log('info', 'Pass a message and this works', {
//   additional: 'properties',
//   are: 'passed along'
// });

// logger.info('Use a helper method if you want', {
//   additional: 'properties',
//   are: 'passed along'
// });

//   // *****
//   // Allows for string interpolation
//   // *****

//   // info: test message my string {}
//   logger.log('info', 'test message %s', 'my string');

//   // info: test message my 123 {}
//   logger.log('info', 'test message %d', 123);

//   // info: test message first second {number: 123}
//   logger.log('info', 'test message %s, %s', 'first', 'second', { number: 123 });

// prints "Found error at %s"
// logger.info('Found %s at %s', 'error', new Date());
// logger.info('Found %s at %s', 'error', new Error('chill winston'));
// logger.info('Found %s at %s', 'error', /WUT/);
// logger.info('Found %s at %s', 'error', true);
// logger.info('Found %s at %s', 'error', 100.00);
// logger.info('Found %s at %s', 'error', ['1, 2, 3']);

//   // *****
//   // Allows for logging Error instances
//   // *****

//   logger.warn(new Error('Error passed as info'));
//   logger.log('error', new Error('Error passed as message'));

//   logger.warn('Maybe important error: ', new Error('Error passed as meta'));
//   logger.log('error', 'Important error: ', new Error('Error passed as meta'));

//   logger.error(new Error('Error as info'));

module.exports = logger;
