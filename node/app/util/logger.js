/* eslint-disable no-console */
const { createLogger, format, transports } = require('winston');
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const { omit } = require('lodash');
const chalk = require('chalk');

require('winston-daily-rotate-file');

const { NODE_ENV, SERVICE_NAME = 'SERVICE_NAME', TEST_LOGS = false } = process.env;
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
    // get all props except some that always need to be same order
    let payload = JSON.stringify(omit(info, ['message', 'level', 'timestamp', 'label']));
    payload = payload === '{}' ? '' : payload;
    // get splat message
    const splat = JSON.stringify(info[Object.getOwnPropertySymbols(info)[1]]) || '';
    // return log in format of : [ts] [env] [service_name] [level] [...]
    return `[${chalk.blue(info.timestamp)}] [${chalk.magentaBright(
      NODE_ENV
    )}] [${chalk.magentaBright(SERVICE_NAME)}] [${info.level}] [${
      info.message
    }] [${chalk.bgBlackBright(payload)}] [${chalk.bgBlackBright(splat)}]`;
  })
};

// TRANSPORTS
const defaultTransport = new transports.DailyRotateFile({
  filename: createLogFileName('info'),
  zippedArchive: WINSTON_CONFIG.zippedArchive,
  maxSize: WINSTON_CONFIG.maxSize,
  maxFiles: WINSTON_CONFIG.maxFiles,
  json: format.json(),
  format: format.logstash()
});
const exceptionsTransport = new transports.DailyRotateFile({
  filename: createLogFileName('exceptions'),
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
  format: format.combine(FORMATS.label, FORMATS.timestamp, format.errors({ stack: true })),
  splat: format.splat(),
  // defaultMeta: {
  //   // some meta data...
  // },
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
if (TEST_LOGS && TEST_LOGS === 'true') {
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
  // info: test message my string {}
  logger.log('info', 'test message %s', 'my string');
  // info: test message my 123 {}
  logger.log('info', 'test message %d', 123);
  // info: test message first second {number: 123}
  logger.log('info', 'test message %s, %s', 'first', 'second', { number: 123 });
  // prints "Found error at %s"
  logger.info('Found %s at %s', 'error', new Date());
  logger.info('Found %s at %s', 'error', new Error('chill winston'));
  logger.info('Found %s at %s', 'error', /WUT/);
  logger.info('Found %s at %s', 'error', true);
  logger.info('Found %s at %s', 'error', 100.0);
  logger.info('Found %s at %s', 'error', ['1, 2, 3']);
  logger.warn(new Error('Error passed as info'));
  logger.log('error', new Error('Error passed as message'));
  logger.warn('Maybe important error: ', new Error('Error passed as meta'));
  logger.log('error', 'Important error: ', new Error('Error passed as meta'));
  logger.error(new Error('Error as info'));
}

// const log = logger.info;
// // Combine styled and normal strings
// log(`${chalk.blue('Hello')} World${chalk.red('!')}`);

// // Compose multiple styles using the chainable API
// log(chalk.blue.bgRed.bold('Hello world!'));

// // Pass in multiple arguments
// log(chalk.blue('Hello', 'World!', 'Foo', 'bar', 'biz', 'baz'));

// // Nest styles
// log(chalk.red('Hello', `${chalk.underline.bgBlue('world')}!`));

// // Nest styles of the same type even (color, underline, background)
// log(
//   chalk.green(
//     `I am a green line ${chalk.blue.underline.bold(
//       'with a blue substring'
//     )} that becomes green again!`
//   )
// );

// // ES2015 template literal
// log(`
// CPU: ${chalk.red('90%')}
// RAM: ${chalk.green('40%')}
// DISK: ${chalk.yellow('70%')}
// // `);

// // // // ES2015 tagged template literal
// // // log(chalk`
// // // CPU: {red ${cpu.totalPercent}%}
// // // RAM: {green ${(ram.used / ram.total) * 100}%}
// // // DISK: {rgb(255,131,0) ${(disk.used / disk.total) * 100}%}
// // // `);

// // Use RGB colors in terminal emulators that support it.
// log(chalk.keyword('orange')('Yay for orange colored text!'));
// log(chalk.rgb(123, 45, 67).underline('Underlined reddish color'));
// log(chalk.hex('#DEADED').bold('Bold gray!'));

module.exports = logger;
