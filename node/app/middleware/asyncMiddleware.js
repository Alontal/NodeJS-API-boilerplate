const { logger } = require('../util');

// taken form https://github.com/Abazhenov/express-async-handler
const asyncUtil = fn =>
  function asyncUtilWrap(...args) {
    const fnReturn = fn(...args);
    const next = args[args.length - 1];
    return Promise.resolve(fnReturn).catch(next => {
      logger.error(
        'asyncMiddleware',
        next.stack ? { msg: next.message, stack: next.stack } : next
      );
      return null;
    });
  };

module.exports = asyncUtil;
