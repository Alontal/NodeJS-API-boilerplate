const { createLogger, format, transports } = require("winston"),
  path = require("path"),
  fs = require("fs"),
  mkdirp = require("mkdirp"),
  { SHORT_DATE } = require("../../config/config").DATE_FORMATS;
require("winston-daily-rotate-file");

const LOG_DIR = path.resolve(__dirname, "..", "..", "LOG/");
if (!fs.existsSync(LOG_DIR)) {
  mkdirp(LOG_DIR, err => {
    if (err) console.error(err);
    else console.log("log directory created!");
  });
}

//daily rotate log files
const daily_rotate_transport = level => ({
  filename: `${LOG_DIR}/${process.env.APP_DOMAIN ||
    "APP_DOMAIN"}-${level}.%DATE%.log`,
  prepend: true,
  maxSize: "20m",
  maxFiles: "14d"
});

console.info("Logs will write to Directory >> ", LOG_DIR);

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({
      format: SHORT_DATE
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
    new transports.DailyRotateFile({
      ...daily_rotate_transport("error"),
      level: "error"
    }),
    new transports.DailyRotateFile(daily_rotate_transport("info"))
  ]
});

// Call exceptions.handle with a transport to handle exceptions
logger.exceptions.handle(
  new transports.DailyRotateFile({
    ...daily_rotate_transport("exceptions"),
    level: "error"
  })
);
//
// If we're not in production then *ALSO* log to the `console`
// with the colorized simple format.
//
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.combine(
        format.json(),
        format.colorize(),
        format.simple(),
        format.printf(
          info =>
            `${info.timestamp}  ${info.level}: ${info.message} ${info.data ||
              info.stack ||
              ""}`
        )
      )
    })
  );
} else {
  //prevent winston to stop if Error occurred
  logger.exitOnError = false;
}

// *****
// Allows for JSON logging
// *****

// logger.log({
// 	level: 'info',
// 	message: 'Pass an object and this works',
// 	additional: 'properties',
// 	are: 'passed along'
//   });

//   logger.info({
// 	message: 'Use a helper method if you want',
// 	additional: 'properties',
// 	are: 'passed along'
//   });

//   // *****
//   // Allows for parameter-based logging
//   // *****

//   logger.log('info', 'Pass a message and this works', {
// 	additional: 'properties',
// 	are: 'passed along'
//   });

//   logger.info('Use a helper method if you want', {
// 	additional: 'properties',
// 	are: 'passed along'
//   });

//   // *****
//   // Allows for string interpolation
//   // *****

//   // info: test message my string {}
//   logger.log('info', 'test message %s', 'my string');

//   // info: test message my 123 {}
//   logger.log('info', 'test message %d', 123);

//   // info: test message first second {number: 123}
//   logger.log('info', 'test message %s, %s', 'first', 'second', { number: 123 });

//   // prints "Found error at %s"
//   logger.info('Found %s at %s', 'error', new Date());
//   logger.info('Found %s at %s', 'error', new Error('chill winston'));
//   logger.info('Found %s at %s', 'error', /WUT/);
//   logger.info('Found %s at %s', 'error', true);
//   logger.info('Found %s at %s', 'error', 100.00);
//   logger.info('Found %s at %s', 'error', ['1, 2, 3']);

//   // *****
//   // Allows for logging Error instances
//   // *****

//   logger.warn(new Error('Error passed as info'));
//   logger.log('error', new Error('Error passed as message'));

//   logger.warn('Maybe important error: ', new Error('Error passed as meta'));
//   logger.log('error', 'Important error: ', new Error('Error passed as meta'));

//   logger.error(new Error('Error as info'));

module.exports = logger;
