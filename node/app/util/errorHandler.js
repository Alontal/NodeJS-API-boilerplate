const { logger } = require('.');

const E = module.exports;
const { NODE_ENV } = process.env;
E.Handle = (message, error, source) => {
  logger.error(`${message} @ ${source}`, {
    Error: error
  });
  return null;
};

/**
 *
 */
function closeProcess() {
  setTimeout(() => {
    logger.error('Closing Process');
    if (NODE_ENV === 'production') process.exit(1);
  }, 2000);
}
// catch ERRORS
process.on('uncaughtException', err => {
  logger.error('uncaughtException', err);
  closeProcess();
});
process.on('unhandledRejection', (reason, p) => {
  logger.info(`unhandledRejection ${reason} p: ${p}`);
  logger.info('reason.stack ', reason.stack || reason);
  closeProcess();
});

process.on('warning', warning => {
  logger.error('warning :', `${warning.name} : ${warning.message}`);
});

process.on('exit', warning => {
  logger.error('warning :', `${warning.name} : ${warning.message}`);
  // TODO: send email notify system crashed with error and stack
});
