/* eslint-disable no-console */
const { createLogger, format, transports } = require('winston');
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const { omit } = require('lodash');
require('winston-daily-rotate-file');

const { NODE_ENV, SERVICE_NAME = 'SERVICE_NAME' } = process.env;
const { dateFormats } = require('.');
const { WINSTON_CONFIG } = require('../../config/config');

const LOG_DIR = path.resolve(
  path.dirname(require.main.filename),
  `../log/${SERVICE_NAME.toLowerCase()}`
);
if (!fs.existsSync(LOG_DIR)) {
  mkdirp(LOG_DIR, err => {
    if (err) console.error(err);
    else console.info('log directory created!');
  });
}
const createLogFileName = level => `${LOG_DIR}/${SERVICE_NAME}-${level}.%DATE%.log`;

// eslint-disable-next-line no-console
console.info('Logs will write to Directory >> ', LOG_DIR);

// FORMATS FOR TRANSPORTS
const FORMATS = {
  label: format.label({
    label: { environment: NODE_ENV, service_name: SERVICE_NAME },
    message: false
  }),
  timestamp: format.timestamp({
    format: dateFormats.SHORT_DATETIME
  }),
  colorize: format.colorize({ all: true }),
  printf: format.printf(info => {
    const payload = JSON.stringify(omit(info, ['message', 'level', 'timestamp', 'label']));
    return `[${info.timestamp}] [${NODE_ENV}] [${SERVICE_NAME}] [${info.level}] [${info.message}] ${
      payload === '{}' ? '' : [payload]
    }`;
  })
};

// TRANSPORTS
const defaultTransport = new transports.DailyRotateFile({
  filename: createLogFileName('info'),
  datePattern: dateFormats.SHORT_DATETIME,
  zippedArchive: WINSTON_CONFIG.zippedArchive,
  maxSize: WINSTON_CONFIG.maxSize,
  maxFiles: WINSTON_CONFIG.maxFiles
});
const exceptionsTransport = new transports.DailyRotateFile({
  filename: createLogFileName('exceptions'),
  datePattern: dateFormats.SHORT_DATETIME,
  zippedArchive: WINSTON_CONFIG.zippedArchive,
  maxSize: WINSTON_CONFIG.maxSize,
  maxFiles: WINSTON_CONFIG.maxFiles
});
const consoleTransport = new transports.Console({
  level: 'debug',
  format: format.combine(FORMATS.timestamp, FORMATS.colorize, FORMATS.printf)
});

const logger = createLogger({
  level: 'info',
  format: format.combine(
    FORMATS.label,
    FORMATS.timestamp,
    format.errors({ stack: true }),
    format.splat()
  ),
  defaultMeta: {
    // some meta data...
  },
  transports: [defaultTransport],
  exceptionHandlers: [exceptionsTransport] // catch exceptions
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

logger.log({
  level: 'info',
  message: 'Pass an object and this works',
  additional: 'properties',
  are: 'passed along'
});

logger.info({
  message: 'Use a helper method if you want',
  additional: 'properties',
  are: 'passed along'
});

// *****
// Allows for parameter-based logging
// *****

logger.log('info', 'Pass a message and this works', {
  additional: 'properties',
  are: 'passed along'
});
const data = {
  additional: 'properties',
  are: 'passed along'
};
logger.info('Use a helper method if you want', data);

// *****
// Allows for string interpolation
// *****

// // info: test message my string {}
// logger.log('info', 'test message %s', 'my string');

// // info: test message my 123 {}
// logger.log('info', 'test message %d', 123);

// // info: test message first second {number: 123}
// logger.log('info', 'test message %s, %s', 'first', 'second', { number: 123 });

// // prints "Found error at %s"
// logger.info('Found %s at %s', 'error', new Date());
// logger.info('Found %s at %s', 'error', new Error('chill winston'));
// logger.info('Found %s at %s', 'error', /WUT/);
// logger.info('Found %s at %s', 'error', true);
// logger.info('Found %s at %s', 'error', 100.0);
// logger.info('Found %s at %s', 'error', ['1, 2, 3']);

// // *****
// // Allows for logging Error instances
// // *****

// logger.warn(new Error('Error passed as info'));
// logger.log('error', new Error('Error passed as message'));

// logger.warn('Maybe important error: ', new Error('Error passed as meta'));
// logger.log('error', 'Important error: ', new Error('Error passed as meta'));

// logger.error(new Error('Error as info'));

module.exports = logger;
